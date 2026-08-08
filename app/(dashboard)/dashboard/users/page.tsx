import { notFound } from "next/navigation";
import { requireOwnerRole } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { getUsers } from "@/features/dashboard/services/user-mgmt-service";
import { Topbar } from "@/components/dashboard/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { UsersView } from "@/components/dashboard/users-view";

export default async function UsersPage() {
  const { businessId } = await requireOwnerRole();
  const [business, users] = await Promise.all([getBusiness(businessId), getUsers(businessId)]);
  if (!business) notFound();

  return (
    <>
      <Topbar title="کاربران" businessName={business.name} isAcceptingOrders={business.isAcceptingOrders} />
      <PanelContent>
        <UsersView
          users={users.map((u) => ({ id: u.id, fullName: u.fullName, phone: u.phone, role: u.role }))}
          maxUsers={business.planMaxUsers}
        />
      </PanelContent>
    </>
  );
}
