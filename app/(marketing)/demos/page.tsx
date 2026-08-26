import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { CtaSection } from "@/components/marketing/cta-section";
import { DemosHero } from "@/components/marketing/demos-hero";
import { DemosGrid } from "@/components/marketing/demos-grid";

export const metadata: Metadata = {
  title: "دموهای زنده ماگ‌منو — منوی دیجیتال کافه، رستوران، فست‌فود و قنادی",
  description:
    "چند نمونه‌ی واقعی از منوی دیجیتال ماگ‌منو برای کافه، رستوران سنتی، فست‌فود و قنادی را ببینید و تجربه‌ی زنده‌ی سفارش‌گیری آنلاین را امتحان کنید.",
  keywords: "دمو منوی دیجیتال, نمونه منوی QR, دمو رستوران, دمو کافه, ماگ‌منو",
  alternates: {
    canonical: "/demos",
  },
  openGraph: {
    title: "دموهای زنده ماگ‌منو",
    description: "نمونه‌های واقعی منوی دیجیتال ماگ‌منو برای انواع کسب‌وکار",
    locale: "fa_IR",
    type: "website",
  },
};

export default function DemosPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <DemosHero />
        <DemosGrid />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
