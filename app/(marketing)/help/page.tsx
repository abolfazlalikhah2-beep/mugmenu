import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { CtaSection } from "@/components/marketing/cta-section";
import { HelpHero } from "@/components/marketing/help-hero";
import { HelpCategories } from "@/components/marketing/help-categories";
import { HelpLatestUpdates } from "@/components/marketing/help-latest-updates";
import { HelpSupport } from "@/components/marketing/help-support";
import { HelpSearchResults } from "@/components/marketing/help-search-results";
import { getLatestArticles, searchArticles } from "@/components/marketing/help-data";

export const metadata: Metadata = {
  title: "مرکز راهنما سِرو — آموزش قدم‌به‌قدم امکانات ماگ‌منو",
  description: "راهنمای کامل ساخت منو، QR کد میز، تنظیمات سفارش، صندوق و پنل مدیریت ماگ‌منو را اینجا پیدا کنید.",
  keywords: "مرکز راهنما ماگ‌منو, آموزش منوی دیجیتال, راهنمای سرو",
  alternates: {
    canonical: "/help",
  },
  openGraph: {
    title: "مرکز راهنما سِرو",
    description: "آموزش قدم‌به‌قدم همه امکانات سِرو",
    locale: "fa_IR",
    type: "website",
  },
};

export default async function HelpPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim();

  return (
    <>
      <SiteHeader />
      <main>
        <HelpHero defaultSearch={query} />
        {query ? (
          <HelpSearchResults query={query} articles={searchArticles(query)} />
        ) : (
          <>
            <HelpCategories />
            <HelpLatestUpdates articles={getLatestArticles()} />
          </>
        )}
        <HelpSupport />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
