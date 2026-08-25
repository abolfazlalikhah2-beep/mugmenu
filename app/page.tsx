import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/features/auth/services/session-service";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
import { SiteHeader } from "@/components/marketing/site-header";
import { HeroSection } from "@/components/marketing/hero-section";
import { AdminPanelSection } from "@/components/marketing/admin-panel-section";
import { StructuredData } from "@/components/marketing/structured-data";

export const metadata: Metadata = {
  title: "ماگ‌منو — منوی دیجیتال هوشمند برای رستوران و کافه",
  description:
    "با ماگ‌منو منوی QR دیجیتال رستوران خود را بسازید. سفارش‌گیری آنلاین، مدیریت آسان، و تجربه بهتر برای مشتریان.",
  keywords: "منوی دیجیتال, منوی QR, سفارش آنلاین رستوران, نرم افزار رستوران",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ماگ‌منو — منوی دیجیتال هوشمند",
    description: "منوی QR دیجیتال برای رستوران و کافه",
    locale: "fa_IR",
    type: "website",
  },
};

export default async function Home() {
  const session = await getSession();
  if (!session) {
    return (
      <>
        <StructuredData />
        <SiteHeader />
        <main>
          <HeroSection />
          <AdminPanelSection />
        </main>
      </>
    );
  }

  const user = await findUserByPhone(session.phone);
  if (user?.isSuperAdmin) redirect("/superadmin");
  redirect(user?.businessId ? "/dashboard" : "/onboarding");
}
