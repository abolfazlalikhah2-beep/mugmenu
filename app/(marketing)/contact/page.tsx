import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { CtaSection } from "@/components/marketing/cta-section";
import { ContactPageHero } from "@/components/marketing/contact-page-hero";
import { ContactChannels } from "@/components/marketing/contact-channels";
import { ContactFormSection } from "@/components/marketing/contact-form-section";
import { ContactFaq } from "@/components/marketing/contact-faq";

export const metadata: Metadata = {
  title: "تماس با ما — ماگ‌منو",
  description:
    "از طریق ایمیل، تیکت پشتیبانی، تلگرام و واتساپ یا فرم تماس با تیم ماگ‌منو در ارتباط باشید؛ برای سوالات، همکاری و درخواست پشتیبانی سریع پاسخ می‌دهیم.",
  keywords: "تماس با ماگ‌منو, پشتیبانی منوی دیجیتال, فرم تماس, ایمیل پشتیبانی",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "تماس با ما — ماگ‌منو",
    description: "راه‌های ارتباط با تیم ماگ‌منو برای سوالات، همکاری و پشتیبانی",
    locale: "fa_IR",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <ContactPageHero />
        <ContactChannels />
        <ContactFormSection />
        <ContactFaq />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
