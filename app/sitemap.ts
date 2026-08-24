import type { MetadataRoute } from "next";
import { getSitemapBusinesses } from "@/features/menu/services/menu-service";
import { getMenuUrl } from "@/lib/menu-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const businesses = await getSitemapBusinesses();

  return businesses.map((business) => ({
    url: getMenuUrl(business),
    changeFrequency: "weekly",
    priority: 0.8,
  }));
}
