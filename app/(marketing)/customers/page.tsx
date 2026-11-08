import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { CtaSection } from "@/components/marketing/cta-section";
import { CustomersHero } from "@/components/marketing/customers-hero";
import { StatsSection } from "@/components/marketing/stats-section";
import { CustomersGrid } from "@/components/marketing/customers-grid";
import { CustomersCaseStudies } from "@/components/marketing/customers-case-studies";
import { CustomersTestimonials } from "@/components/marketing/customers-testimonials";

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
        <StatsSection />
        <CustomersGrid />
        <CustomersCaseStudies />
        <CustomersTestimonials />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
