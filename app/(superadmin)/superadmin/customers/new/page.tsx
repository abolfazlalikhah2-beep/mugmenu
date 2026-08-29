import { requireSuperAdmin } from "@/features/auth/services/authorize";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
import { getPlansForPicker } from "@/features/superadmin/services/customer-service";
import { Topbar } from "@/components/superadmin/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { NewCustomerView } from "@/components/superadmin/new-customer-view";

export default async function SuperAdminNewCustomerPage() {
  const { session } = await requireSuperAdmin();
  const [agent, plans] = await Promise.all([findUserByPhone(session.phone), getPlansForPicker()]);

  return (
    <>
      <Topbar title="افزودن مشتری" agentName={agent?.fullName ?? "سوپرادمین"} />
      <PanelContent>
        <NewCustomerView plans={plans} />
      </PanelContent>
    </>
  );
}
