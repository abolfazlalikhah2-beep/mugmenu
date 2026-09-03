import { requireSuperAdmin } from "@/features/auth/services/authorize";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
import { getLeadCaptures } from "@/features/leads/services/lead-service";
import { Topbar } from "@/components/superadmin/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { LeadsView } from "@/components/superadmin/leads-view";

export default async function SuperAdminLeadsPage() {
  const { session } = await requireSuperAdmin();

  const [agent, leads] = await Promise.all([findUserByPhone(session.phone), getLeadCaptures()]);

  return (
    <>
      <Topbar title="لیدهای ثبت‌شده" agentName={agent?.fullName ?? "سوپرادمین"} />
      <PanelContent>
        <LeadsView leads={leads} />
      </PanelContent>
    </>
  );
}
