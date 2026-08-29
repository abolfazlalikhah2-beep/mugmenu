import { notFound, redirect } from "next/navigation";
import { requireOwnerRole } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { getPlanPricing, pickRandomActiveCard } from "@/features/payments/services/payment-service";
import { Topbar } from "@/components/dashboard/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { PaymentPageView } from "@/components/dashboard/payment-page-view";

// This page never takes a planId from the client — it's a renewal of the
// business's OWN current plan, never a picker for a different one (no
// self-service plan upgrade, see AccountView/PlanCard and CLAUDE.md phase
// 3). Purchases are 6-month or annual only — MONTHLY still exists as a
// concept for a business's *current* cycle (legacy accounts, or the
// super-admin's manual verify step can still grant it), this page just
// never offers it as a purchase option.
export default async function PaymentPage() {
  const { businessId } = await requireOwnerRole();

  const business = await getBusiness(businessId);
  if (!business) notFound();

  const [sixMonthPricing, annualPricing] = await Promise.all([
    getPlanPricing(business.planId, "SIX_MONTH"),
    getPlanPricing(business.planId, "ANNUAL"),
  ]);
  if (!sixMonthPricing || !annualPricing) redirect("/dashboard/account");

  const card = await pickRandomActiveCard();

  return (
    <>
      <Topbar title="پرداخت اشتراک" businessName={business.name} />
      <PanelContent>
        <PaymentPageView
          options={[sixMonthPricing, annualPricing]}
          defaultBillingCycle={business.billingCycle === "MONTHLY" ? "SIX_MONTH" : business.billingCycle}
          card={card}
        />
      </PanelContent>
    </>
  );
}
