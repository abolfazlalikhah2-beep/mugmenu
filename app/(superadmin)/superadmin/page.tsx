import { requireSuperAdmin } from "@/features/auth/services/authorize";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
import { getDashboardOverview } from "@/features/superadmin/services/dashboard-service";
import { Topbar } from "@/components/superadmin/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { DashboardView } from "@/components/superadmin/dashboard-view";

export default async function SuperAdminHome() {
  const { session } = await requireSuperAdmin();
  const [agent, overview] = await Promise.all([findUserByPhone(session.phone), getDashboardOverview()]);

  return (
    <>
      <Topbar title="داشبورد" agentName={agent?.fullName ?? "سوپرادمین"} />
      <PanelContent>
        <DashboardView overview={overview} />
      </PanelContent>
    </>
  );
}
