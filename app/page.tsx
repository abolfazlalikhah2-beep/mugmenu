import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/features/auth/services/session-service";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
import { getActiveBusinessSlugs } from "@/features/menu/repositories/menu-repository";
import { SiteHeader } from "@/components/marketing/site-header";
import { HeroSection } from "@/components/marketing/hero-section";
import { AdminPanelSection } from "@/components/marketing/admin-panel-section";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import { PricingSection } from "@/components/marketing/pricing-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { SiteFooter } from "@/components/marketing/site-footer";
import { StructuredData } from "@/components/marketing/structured-data";

export const metadata: Metadata = {
  title: "سِرو — منوی هوشمند برای کسب‌وکارهای خوشمزه",
  description:
    "با سِرو منوی QR دیجیتال رستوران خود را بسازید. سفارش‌گیری آنلاین، مدیریت آسان، و تجربه بهتر برای مشتریان.",
  keywords: "منوی دیجیتال, منوی QR, سفارش آنلاین رستوران, نرم افزار رستوران",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "سِرو — منوی دیجیتال هوشمند",
    description: "منوی QR دیجیتال برای رستوران و کافه",
    locale: "fa_IR",
    type: "website",
  },
};

async function getPreviewSlug() {
  const businesses = await getActiveBusinessSlugs();
  const demo = businesses.find((b) => b.slug === "demo");
  return demo?.slug ?? businesses[0]?.slug ?? "demo";
}

export default async function Home() {
  const session = await getSession();
  if (!session) {
    const previewSlug = await getPreviewSlug();
    return (
      <>
        <StructuredData />
        <SiteHeader />
        <main>
          <HeroSection previewSlug={previewSlug} />
          <HowItWorks />
          <AdminPanelSection />
          <FeaturesGrid />
          <PricingSection />
          <FaqSection />
          <CtaSection />
        </main>
        <SiteFooter />
      </>
    );
  }

  const user = await findUserByPhone(session.phone);
  if (user?.isSuperAdmin) redirect("/superadmin");
  redirect(user?.businessId ? "/dashboard" : "/onboarding");
}
