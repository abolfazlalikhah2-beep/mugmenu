import type { NextConfig } from "next";

/**
 * Allows next/image to load uploaded product/category/logo images. The S3
 * endpoint (or S3_PUBLIC_URL, for providers whose public read domain
 * differs from the upload endpoint) isn't known until deploy time, so this
 * reads it from env rather than hardcoding a provider's hostname.
 */
function s3RemotePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const raw = process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT;
  if (!raw) return [];
  try {
    const url = new URL(raw);
    return [
      {
        protocol: url.protocol === "https:" ? "https" : "http",
        hostname: url.hostname,
        port: url.port || undefined,
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: s3RemotePatterns(),
  },
};

export default nextConfig;
