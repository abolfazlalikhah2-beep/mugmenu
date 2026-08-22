import { notFound } from "next/navigation";
import { requireOwnerRole } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { getAccountOverview } from "@/features/dashboard/services/account-service";
import { Topbar } from "@/components/dashboard/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { AccountView } from "@/components/dashboard/account-view";

export default async function AccountPage() {
  const { businessId } = await requireOwnerRole();
  const [business, overview] = await Promise.all([getBusiness(businessId), getAccountOverview(businessId)]);
  if (!business || !overview) notFound();

  return (
    <>
      <Topbar title="حساب کاربری" businessName={business.name} />
      <PanelContent>
        <AccountView
          planId={overview.planId}
          billingCycle={overview.billingCycle}
          planName={overview.planName}
          priceToman={overview.planPriceToman}
          expiresAt={overview.planExpiresAt}
          maxUsers={overview.planMaxUsers}
          status={overview.status}
          featureLabels={overview.featureLabels}
          paymentRequests={overview.paymentRequests}
        />
      </PanelContent>
    </>
  );
}
