import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { getTickets } from "@/features/dashboard/services/support-service";
import { Topbar } from "@/components/dashboard/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { SupportView } from "@/components/dashboard/support-view";

export default async function SupportPage() {
  const { businessId } = await requireBusinessOwner();
  const [business, tickets] = await Promise.all([getBusiness(businessId), getTickets(businessId)]);
  if (!business) return null;

  return (
    <>
      <Topbar title="پشتیبانی" businessName={business.name} />
      <PanelContent>
        <SupportView tickets={tickets} />
      </PanelContent>
    </>
  );
}
