import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

/**
 * One-time backfill: rewrites existing Business.logoUrl / Category.imageUrl /
 * Product.imageUrl / TicketMessage.attachmentUrl / SiteSetting.value
 * (logo_url, favicon_url) rows that still point at the old S3 endpoint
 * hostnames to the new cdn.serwapp.com custom domain, now that
 * S3_PUBLIC_URL is set so newly uploaded files already use it.
 *
 * Not required for correctness — both old hostnames stay allowlisted in
 * next.config.ts and still serve the same objects (verified: identical
 * bytes/content-type as cdn.serwapp.com) — this is purely so old images also
 * benefit from the CDN domain.
 *
 * Old URLs are path-style (bucket name in the path): https://<old-host>/serwapp-uploads/<key>
 * New URLs are virtual-host style via the custom domain: https://cdn.serwapp.com/<key>
 * (see the `base` logic in features/uploads/services/storage-service.ts)
 *
 * Defaults to a dry run — prints every row that would change with old/new
 * values side by side, changes nothing. Pass --apply to actually write.
 *
 * Usage:
 *   npx tsx scripts/backfill-cdn-urls.ts            # dry run
 *   npx tsx scripts/backfill-cdn-urls.ts --apply     # actually update
 */

const OLD_PREFIXES = [
  "https://storage.iran.liara.space/serwapp-uploads/",
  "https://storage.c2.liara.site/serwapp-uploads/",
];
const NEW_PREFIX = "https://cdn.serwapp.com/";

const APPLY = process.argv.includes("--apply");

function rewrite(url: string | null): string | null {
  if (!url) return url;
  for (const prefix of OLD_PREFIXES) {
    if (url.startsWith(prefix)) {
      return NEW_PREFIX + url.slice(prefix.length);
    }
  }
  return url;
}

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  let totalChanges = 0;

  const businesses = await prisma.business.findMany({
    where: { logoUrl: { not: null } },
    select: { id: true, name: true, logoUrl: true },
  });
  for (const b of businesses) {
    const next = rewrite(b.logoUrl);
    if (next !== b.logoUrl) {
      totalChanges++;
      console.log(`[Business ${b.id}] "${b.name}" logoUrl:\n  ${b.logoUrl}\n  -> ${next}`);
      if (APPLY) await prisma.business.update({ where: { id: b.id }, data: { logoUrl: next } });
    }
  }

  const categories = await prisma.category.findMany({
    where: { imageUrl: { not: null } },
    select: { id: true, name: true, imageUrl: true },
  });
  for (const c of categories) {
    const next = rewrite(c.imageUrl);
    if (next !== c.imageUrl) {
      totalChanges++;
      console.log(`[Category ${c.id}] "${c.name}" imageUrl:\n  ${c.imageUrl}\n  -> ${next}`);
      if (APPLY) await prisma.category.update({ where: { id: c.id }, data: { imageUrl: next } });
    }
  }

  const products = await prisma.product.findMany({
    where: { imageUrl: { not: null } },
    select: { id: true, name: true, imageUrl: true },
  });
  for (const p of products) {
    const next = rewrite(p.imageUrl);
    if (next !== p.imageUrl) {
      totalChanges++;
      console.log(`[Product ${p.id}] "${p.name}" imageUrl:\n  ${p.imageUrl}\n  -> ${next}`);
      if (APPLY) await prisma.product.update({ where: { id: p.id }, data: { imageUrl: next } });
    }
  }

  const attachments = await prisma.ticketMessage.findMany({
    where: { attachmentUrl: { not: null } },
    select: { id: true, attachmentUrl: true },
  });
  for (const t of attachments) {
    const next = rewrite(t.attachmentUrl);
    if (next !== t.attachmentUrl) {
      totalChanges++;
      console.log(`[TicketMessage ${t.id}] attachmentUrl:\n  ${t.attachmentUrl}\n  -> ${next}`);
      if (APPLY) await prisma.ticketMessage.update({ where: { id: t.id }, data: { attachmentUrl: next } });
    }
  }

  const siteSettings = await prisma.siteSetting.findMany({
    where: { key: { in: ["logo_url", "favicon_url"] } },
  });
  for (const s of siteSettings) {
    const next = rewrite(s.value);
    if (next !== s.value) {
      totalChanges++;
      console.log(`[SiteSetting ${s.key}] value:\n  ${s.value}\n  -> ${next}`);
      if (APPLY) await prisma.siteSetting.update({ where: { id: s.id }, data: { value: next! } });
    }
  }

  console.log(`\n${totalChanges} row(s) ${APPLY ? "updated" : "would be updated"}.`);
  if (!APPLY && totalChanges > 0) console.log("Re-run with --apply to write these changes.");

  await prisma.$disconnect();
}

main();
