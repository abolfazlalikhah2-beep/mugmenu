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
  searchParams: Promise<{ planId?: string }>;
}) {
  const { businessId } = await requireOwnerRole();
  const { planId } = await searchParams;

  // New subscription purchases are annual-only (with the discounted annual
  // price already baked into Plan.annualPrice) — any billingCycle query
  // param is ignored here on purpose. MONTHLY still exists as a concept
  // elsewhere (a business's *current* plan can be on it, e.g. legacy
  // accounts — see AccountView/PlanCard, and the super-admin's manual
  // verify step can still grant it), this page just never offers it.
  const [business, pricing] = await Promise.all([
    getBusiness(businessId),
    planId ? getPlanPricing(planId, "ANNUAL") : Promise.resolve(null),
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
