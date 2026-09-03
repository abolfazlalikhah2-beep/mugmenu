# syntax=docker/dockerfile:1

# ---- base --------------------------------------------------------------
# Same Node major version in every stage (dev included, via docker-compose)
# so "works in dev" and "works in prod" mean the same runtime.
FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# ---- deps ----------------------------------------------------------------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- dev -------------------------------------------------------------
# Used directly by docker-compose for local development (bind-mounts source
# over this, runs `next dev`). Kept as its own stage so dev never drifts
# from the same base image / Node version as the prod build below.
FROM deps AS dev
COPY . .
RUN npx prisma generate
EXPOSE 3000
# The bind mount in docker-compose.yml shadows everything COPY'd above at
# runtime, so re-run migrate+generate against the live source on boot
# (single instance in dev — safe to run on every start).
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && npm run dev"]

# ---- builder ---------------------------------------------------------
FROM deps AS builder
COPY . .
RUN npx prisma generate
RUN npm run build
# Verify Next.js actually generated images-manifest.json where we expect it,
# right after the build that's supposed to produce it — if this fails, the
# problem is generation (Next.js output changed), not the later COPY.
RUN ls -la /app/.next/ && test -f /app/.next/images-manifest.json || (echo "BUILD FAILED: images-manifest.json missing from /app/.next/ after next build" && exit 1)

# ---- runner (prod) -----------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# next build's file tracing for .next/standalone omits images-manifest.json
# (it lives at the top level of .next/, not under .next/standalone/.next/),
# so without this next/image rejects every remote host at runtime — no
# manifest means no remotePatterns to match against, regardless of what
# next.config.ts says. Confirmed missing via `find / -name images-manifest.json`
# inside the running container turning up nothing.
COPY --from=builder --chown=nextjs:nodejs /app/.next/images-manifest.json ./.next/images-manifest.json
# Verify the copy actually landed in the runner stage too — if the builder
# check above passed but this one fails, the problem is the COPY/cache layer
# itself, not generation. Fail the image build loudly instead of shipping a
# runner that's silently missing it (see incident notes in CLAUDE.md).
RUN ls -la /app/.next/ && test -f /app/.next/images-manifest.json || (echo "BUILD FAILED: images-manifest.json missing from runner /app/.next/ after COPY" && exit 1)
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts
# next build's standalone output only bundles node_modules traced from
# runtime imports, which excludes the prisma CLI (nothing at runtime
# imports it). Overlay the full node_modules from the builder stage so
# `prisma migrate deploy` below has the CLI available.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs
EXPOSE 3000
ENV PORT=3000
# `migrate deploy` on boot was tried (see git history) and reverted:
# production's `_prisma_migrations` table doesn't exist / isn't properly
# tracked (schema drifted from ad hoc changes before Prisma Migrate was
# adopted — see the OtpPurpose/BillingCycle/Plan.sixMonthPrice incidents in
# CLAUDE.md), so `migrate deploy` would try to replay ALL migrations from
# scratch on every boot, including `CREATE TABLE "Business"` etc. against
# tables that already exist — which fails immediately, and because this is
# `A && B`, `node server.js` never runs: the whole container fails to boot,
# every single deploy, until someone manually intervenes. Until production's
# migration history is properly baselined (blocked on Liara console access —
# the 512MB writable overlay can't fit `npx prisma`'s install), schema
# changes are applied manually via PGAdmin per migration — see CLAUDE.md.
CMD ["node", "server.js"]
