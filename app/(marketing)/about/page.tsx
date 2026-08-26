import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { CtaSection } from "@/components/marketing/cta-section";
import { AboutHero } from "@/components/marketing/about-hero";
import { AboutProblemSolution } from "@/components/marketing/about-problem-solution";
import { AboutHowWeWork } from "@/components/marketing/about-how-we-work";
import { AboutWhyTrust } from "@/components/marketing/about-why-trust";
import { AboutFaq } from "@/components/marketing/about-faq";
import { AboutBlogPreview } from "@/components/marketing/about-blog-preview";

export const metadata: Metadata = {
  title: "درباره ماگ‌منو — چرا منوی دیجیتال و مدیریت هوشمند رستوران",
  description:
    "ماگ‌منو را ساختیم تا مدیریت منو و سفارش برای رستوران‌ها و کافه‌های ایرانی ساده، سریع و بدون دردسر شود. با روش کار و دلایل اعتماد به ماگ‌منو آشنا شوید.",
  keywords: "درباره ماگ‌منو, منوی دیجیتال, مدیریت رستوران, منوی QR",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "درباره ماگ‌منو",
    description: "چرا ماگ‌منو را ساختیم و چطور به رستوران‌ها و کافه‌ها کمک می‌کند",
    locale: "fa_IR",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <AboutHero />
        <AboutProblemSolution />
        <AboutHowWeWork />
        <AboutWhyTrust />
        <AboutFaq />
        <AboutBlogPreview />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
