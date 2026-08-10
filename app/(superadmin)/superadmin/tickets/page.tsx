import { requireSuperAdmin } from "@/features/auth/services/authorize";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
import { getInboundTickets } from "@/features/superadmin/services/ticket-service";
import { getBusinessesForPicker } from "@/features/superadmin/services/customer-service";
import type { TicketStatus } from "@/lib/generated/prisma/enums";
import { Topbar } from "@/components/superadmin/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { TicketsView } from "@/components/superadmin/tickets-view";
import { NewTicketTrigger } from "@/components/superadmin/new-ticket-trigger";

const VALID_STATUSES: TicketStatus[] = ["OPEN", "PENDING", "ANSWERED", "CLOSED"];

export default async function SuperAdminTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; newFor?: string }>;
}) {
  const { q, status, newFor } = await searchParams;
  const { session } = await requireSuperAdmin();
  const statusFilter = VALID_STATUSES.find((s) => s === status);

  const [agent, tickets, businesses] = await Promise.all([
    findUserByPhone(session.phone),
    getInboundTickets({ status: statusFilter, search: q?.trim() || undefined }),
    getBusinessesForPicker(),
  ]);

  return (
    <>
      <Topbar
        title="تیکت‌ها"
        agentName={agent?.fullName ?? "سوپرادمین"}
        action={
          <NewTicketTrigger
            businesses={businesses.map((b) => ({ id: b.id, name: b.name, ownerName: b.owners[0]?.fullName ?? null }))}
            initialBusinessId={newFor}
          />
        }
      />
      <PanelContent>
        <TicketsView tickets={tickets} q={q ?? ""} status={statusFilter} />
      </PanelContent>
    </>
  );
}
