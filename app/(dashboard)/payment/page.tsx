import { notFound, redirect } from "next/navigation";
import { requireOwnerRole } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { getPlanPricing, pickRandomActiveCard } from "@/features/payments/services/payment-service";
import { Topbar } from "@/components/dashboard/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { PaymentPageView } from "@/components/dashboard/payment-page-view";

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ planId?: string; billingCycle?: string }>;
}) {
  const { businessId } = await requireOwnerRole();
  const { planId, billingCycle } = await searchParams;
  const cycle = billingCycle === "ANNUAL" ? "ANNUAL" : "MONTHLY";

  const [business, pricing] = await Promise.all([
    getBusiness(businessId),
    planId ? getPlanPricing(planId, cycle) : Promise.resolve(null),
  ]);
  if (!business) notFound();
  if (!pricing) redirect("/dashboard/account");

  const card = await pickRandomActiveCard();

  return (
    <>
      <Topbar title="پرداخت اشتراک" businessName={business.name} />
      <PanelContent>
        <PaymentPageView pricing={pricing} card={card} />
      </PanelContent>
    </>
  );
}
