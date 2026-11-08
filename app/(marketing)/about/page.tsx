import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { CtaSection } from "@/components/marketing/cta-section";
import { AboutHero } from "@/components/marketing/about-hero";
import { AboutStory } from "@/components/marketing/about-story";
import { AboutValues } from "@/components/marketing/about-values";
import { StatsSection } from "@/components/marketing/stats-section";
import { AboutTeam } from "@/components/marketing/about-team";

export const metadata: Metadata = {
  title: "درباره سِرو — چرا منوی دیجیتال و مدیریت هوشمند رستوران",
  description:
    "سِرو را ساختیم تا مدیریت منو و سفارش برای رستوران‌ها و کافه‌های ایرانی ساده، سریع و بدون دردسر شود. با داستان، ارزش‌ها و تیم سِرو آشنا شوید.",
  keywords: "درباره سِرو, منوی دیجیتال, مدیریت رستوران, منوی QR",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "درباره سِرو",
    description: "چرا سِرو را ساختیم و چطور به رستوران‌ها و کافه‌ها کمک می‌کند",
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
        <AboutStory />
        <AboutValues />
        <StatsSection />
        <AboutTeam />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
