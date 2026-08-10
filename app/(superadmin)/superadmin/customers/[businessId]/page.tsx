import { notFound } from "next/navigation";
import { requireSuperAdmin } from "@/features/auth/services/authorize";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
import { getCustomerDetail } from "@/features/superadmin/services/customer-service";
import { Topbar } from "@/components/superadmin/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { CustomerDetailView } from "@/components/superadmin/customer-detail-view";

export default async function SuperAdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  const { session } = await requireSuperAdmin();
  const [agent, detail] = await Promise.all([findUserByPhone(session.phone), getCustomerDetail(businessId)]);
  if (!detail) notFound();

  return (
    <>
      <Topbar title="جزئیات مشتری" agentName={agent?.fullName ?? "سوپرادمین"} />
      <PanelContent>
        <CustomerDetailView detail={detail} />
      </PanelContent>
    </>
  );
}
