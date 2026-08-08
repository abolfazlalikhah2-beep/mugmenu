import { notFound } from "next/navigation";
import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { Topbar } from "@/components/dashboard/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { SettingsView } from "@/components/dashboard/settings-view";

export default async function SettingsPage() {
  const { businessId } = await requireBusinessOwner();
  const business = await getBusiness(businessId);
  if (!business) notFound();

  return (
    <>
      <Topbar title="تنظیمات" businessName={business.name} isAcceptingOrders={business.isAcceptingOrders} />
      <PanelContent>
        <SettingsView business={business} />
      </PanelContent>
    </>
  );
}
