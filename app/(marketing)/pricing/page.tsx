import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { CtaSection } from "@/components/marketing/cta-section";
import { PricingHero } from "@/components/marketing/pricing-hero";
import { PricingPlansSection } from "@/components/marketing/pricing-plans-section";
import { PricingComparisonTable } from "@/components/marketing/pricing-comparison-table";
import { PricingFaq } from "@/components/marketing/pricing-faq";

export const metadata: Metadata = {
  title: "تعرفه‌ها و قیمت‌ها — سِرو | منوی دیجیتال رستوران",
  description:
    "پلن‌های سِرو را مقایسه کنید. از نمایش منوی QR رایگان تا سفارش‌گیری آنلاین حرفه‌ای. بدون کارت بانکی، شروع رایگان.",
  keywords: "قیمت منوی دیجیتال, تعرفه نرم‌افزار رستوران, اشتراک منوی QR",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "تعرفه‌های سِرو — منوی دیجیتال رستوران",
    description: "پلن مناسب رستوران خود را انتخاب کنید",
    locale: "fa_IR",
    type: "website",
  },
};

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PricingHero />
        <PricingPlansSection />
        <PricingComparisonTable />
        <PricingFaq />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
