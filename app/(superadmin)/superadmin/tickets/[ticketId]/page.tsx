import { notFound } from "next/navigation";
import { requireSuperAdmin } from "@/features/auth/services/authorize";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
import { getTicketDetail } from "@/features/superadmin/services/ticket-service";
import { Topbar } from "@/components/superadmin/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { AgentTicketDetailView } from "@/components/superadmin/agent-ticket-detail-view";

export default async function SuperAdminTicketDetailPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  const { session } = await requireSuperAdmin();
  const [agent, ticket] = await Promise.all([findUserByPhone(session.phone), getTicketDetail(ticketId)]);
  if (!ticket) notFound();

  return (
    <>
      <Topbar title="جزئیات تیکت" agentName={agent?.fullName ?? "سوپرادمین"} />
      <PanelContent>
        <AgentTicketDetailView ticket={ticket} />
      </PanelContent>
    </>
  );
}
