import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { CtaSection } from "@/components/marketing/cta-section";
import { BlogHero } from "@/components/marketing/blog-hero";
import { BlogSection } from "@/components/marketing/blog-section";

export const metadata: Metadata = {
  title: "بلاگ ماگ‌منو — راهنمای منوی دیجیتال و مدیریت رستوران",
  description:
    "مقاله‌ها و راهنماهای کاربردی ماگ‌منو درباره‌ی منوی دیجیتال QR، مدیریت سفارش رستوران و کافه، و رشد کسب‌وکار غذایی.",
  keywords: "بلاگ منوی دیجیتال, آموزش مدیریت رستوران, منوی QR, ماگ‌منو",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "بلاگ ماگ‌منو",
    description: "مقاله‌ها و راهنماهای کاربردی درباره‌ی منوی دیجیتال و مدیریت رستوران",
    locale: "fa_IR",
    type: "website",
  },
};

export default function BlogPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <BlogHero />
        <BlogSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
