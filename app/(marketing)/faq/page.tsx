import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { CtaSection } from "@/components/marketing/cta-section";
import { FaqPageHero } from "@/components/marketing/faq-page-hero";
import { FaqList } from "@/components/marketing/faq-list";
import { FaqStructuredData } from "@/components/marketing/faq-structured-data";

export const metadata: Metadata = {
  title: "سوالات متداول ماگ‌منو — راهنمای اشتراک، سفارش‌گیری و پرداخت",
  description:
    "پاسخ پرتکرارترین سوالات درباره‌ی ماگ‌منو را بخوانید: نحوه‌ی فعال‌سازی اشتراک، حالت‌های سفارش، سیستم نسیه، پرداخت کارت‌به‌کارت و گزارش‌گیری فروش.",
  keywords: "سوالات متداول ماگ‌منو, راهنمای منوی دیجیتال, اشتراک ماگ‌منو, پشتیبانی ماگ‌منو",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "سوالات متداول ماگ‌منو",
    description: "پاسخ پرتکرارترین سوالات درباره‌ی منوی دیجیتال، اشتراک‌ها و امکانات ماگ‌منو",
    locale: "fa_IR",
    type: "website",
  },
};

export default function FaqPage() {
  return (
    <>
      <FaqStructuredData />
      <SiteHeader />
      <main>
        <FaqPageHero />
        <FaqList />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
