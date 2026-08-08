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

# ---- runner (prod) -----------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
