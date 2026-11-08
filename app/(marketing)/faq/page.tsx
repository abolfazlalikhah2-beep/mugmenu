import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { CtaSection } from "@/components/marketing/cta-section";
import { FaqExplorer } from "@/components/marketing/faq-explorer";
import { FaqStructuredData } from "@/components/marketing/faq-structured-data";

export const metadata: Metadata = {
  title: "سوالات متداول سِرو — راهنمای اشتراک، سفارش‌گیری و پرداخت",
  description:
    "پاسخ پرتکرارترین سوالات درباره‌ی سِرو را بخوانید: نحوه‌ی فعال‌سازی اشتراک، حالت‌های سفارش، سیستم نسیه، پرداخت کارت‌به‌کارت و گزارش‌گیری فروش.",
  keywords: "سوالات متداول سِرو, راهنمای منوی دیجیتال, اشتراک سِرو, پشتیبانی سِرو",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "سوالات متداول سِرو",
    description: "پاسخ پرتکرارترین سوالات درباره‌ی منوی دیجیتال، اشتراک‌ها و امکانات سِرو",
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
        <FaqExplorer />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
