import type { MetadataRoute } from "next";
import { getSitemapBusinesses } from "@/features/menu/services/menu-service";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const businesses = await getSitemapBusinesses();

  return businesses.map((business) => ({
    url: `${BASE_URL}/${business.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));
}
