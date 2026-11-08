import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { CtaSection } from "@/components/marketing/cta-section";
import { TermsHero } from "@/components/marketing/terms-hero";
import { TermsContent } from "@/components/marketing/terms-content";

export const metadata: Metadata = {
  title: "قوانین و مقررات سِرو",
  description: "قوانین و مقررات استفاده از پلتفرم منوی دیجیتال سِرو، شامل شرایط اشتراک، پرداخت، بازگشت وجه و حریم خصوصی داده‌ها.",
  keywords: "قوانین سِرو, مقررات سِرو, شرایط استفاده از خدمات",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "قوانین و مقررات سِرو",
    description: "قوانین و مقررات استفاده از پلتفرم منوی دیجیتال سِرو",
    locale: "fa_IR",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <TermsHero />
        <TermsContent />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
