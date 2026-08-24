import { requireSuperAdmin } from "@/features/auth/services/authorize";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
import { getTeamUsers } from "@/features/superadmin/services/team-service";
import { Topbar } from "@/components/superadmin/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { TeamView } from "@/components/superadmin/team-view";

export default async function SuperAdminUsersPage() {
  const { session } = await requireSuperAdmin();
  const [agent, users] = await Promise.all([findUserByPhone(session.phone), getTeamUsers()]);

  return (
    <>
      <Topbar title="کاربران" agentName={agent?.fullName ?? "سوپرادمین"} />
      <PanelContent>
        <TeamView
          users={users.map((u) => ({
            id: u.id,
            fullName: u.fullName,
            phone: u.phone,
            // platformRole is nullable in the DB (only set for isSuperAdmin
            // users, but not enforced) — a superadmin row created without it
            // (e.g. manual SQL bootstrap) must not crash the page.
            platformRole: u.platformRole ?? "VIEWER",
            platformTeam: u.platformTeam,
            lastLoginAt: u.lastLoginAt,
            isActive: u.isActive,
          }))}
        />
      </PanelContent>
    </>
  );
}
