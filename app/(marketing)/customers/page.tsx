import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { CtaSection } from "@/components/marketing/cta-section";
import { CustomersHero } from "@/components/marketing/customers-hero";
import { CustomersGrid } from "@/components/marketing/customers-grid";

export const metadata: Metadata = {
  title: "مشتریان سِرو — کسب‌وکارهایی که با ما همراه شده‌اند",
  description: "کسب‌وکارهایی که با منوی هوشمند سِرو رشد کرده‌اند.",
  alternates: {
    canonical: "/customers",
  },
  openGraph: {
    title: "مشتریان سِرو",
    description: "کسب‌وکارهایی که با منوی هوشمند سِرو رشد کرده‌اند",
    locale: "fa_IR",
    type: "website",
  },
};

export default function CustomersPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <CustomersHero />
        <CustomersGrid />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
