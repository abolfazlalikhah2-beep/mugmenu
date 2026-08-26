import type { NextConfig } from "next";

/**
 * Liara rotated its S3-compatible storage hostname from storage.iran.liara.space
 * to storage.c2.liara.site. Images uploaded before the switch still have URLs
 * pointing at the old hostname stored in the DB, so both must stay allowlisted
 * even after S3_ENDPOINT is updated to the new one.
 */
const KNOWN_S3_HOSTNAMES = ["storage.iran.liara.space", "storage.c2.liara.site"];

/**
 * Allows next/image to load uploaded product/category/logo images. The S3
 * endpoint (or S3_PUBLIC_URL, for providers whose public read domain
 * differs from the upload endpoint) isn't known until deploy time, so this
 * reads it from env rather than hardcoding a provider's hostname — except
 * for the known Liara hostnames above, which are always allowlisted.
 */
function s3RemotePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = KNOWN_S3_HOSTNAMES.map((hostname) => ({
    protocol: "https",
    hostname,
  }));

  const raw = process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT;
  if (raw) {
    try {
      const url = new URL(raw);
      if (!KNOWN_S3_HOSTNAMES.includes(url.hostname)) {
        patterns.push({
          protocol: url.protocol === "https:" ? "https" : "http",
          hostname: url.hostname,
          port: url.port || undefined,
        });
      }
    } catch {
      // invalid URL in env — known hostnames above still apply
    }
  }

  return patterns;
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: s3RemotePatterns(),
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
