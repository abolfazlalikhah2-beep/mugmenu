import { requireSuperAdmin } from "@/features/auth/services/authorize";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
import { getSettings } from "@/features/site-settings/services/site-setting-service";
import { Topbar } from "@/components/superadmin/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { SiteSettingsView } from "@/components/superadmin/site-settings-view";

export default async function SuperAdminSiteSettingsPage() {
  const { session } = await requireSuperAdmin();
  const [agent, settings] = await Promise.all([findUserByPhone(session.phone), getSettings()]);

  return (
    <>
      <Topbar title="تنظیمات سایت" agentName={agent?.fullName ?? "سوپرادمین"} />
      <PanelContent>
        <SiteSettingsView settings={settings} />
      </PanelContent>
    </>
  );
}
