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

// AboutBlogPreview queries prisma.blogPost at render time (getPublishedPosts)
// — the database isn't reachable during `next build`'s static prerendering
// step (Docker build vs. runtime, see Dockerfile), so this page must render
// per-request instead of being statically generated. Same fix already
// applied to /blog and /blog/[slug] for the same reason.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "درباره سِرو — چرا منوی دیجیتال و مدیریت هوشمند رستوران",
  description:
    "سِرو را ساختیم تا مدیریت منو و سفارش برای رستوران‌ها و کافه‌های ایرانی ساده، سریع و بدون دردسر شود. با روش کار و دلایل اعتماد به سِرو آشنا شوید.",
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
