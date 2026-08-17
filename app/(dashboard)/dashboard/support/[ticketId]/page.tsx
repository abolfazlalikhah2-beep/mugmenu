import { notFound } from "next/navigation";
import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { getTicketDetail } from "@/features/dashboard/services/support-service";
import { Topbar } from "@/components/dashboard/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { TicketDetailView } from "@/components/dashboard/ticket-detail-view";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  const { businessId } = await requireBusinessOwner();
  const [business, ticket] = await Promise.all([
    getBusiness(businessId),
    getTicketDetail(businessId, ticketId),
  ]);
  if (!business || !ticket) notFound();

  return (
    <>
      <Topbar title="جزئیات تیکت" businessName={business.name} />
      <PanelContent>
        <TicketDetailView ticket={ticket} />
      </PanelContent>
    </>
  );
}
