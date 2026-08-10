import { requireSuperAdmin } from "@/features/auth/services/authorize";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
import { getCustomers } from "@/features/superadmin/services/customer-service";
import type { SubscriptionStatus } from "@/features/superadmin/services/subscription-status";
import { Topbar } from "@/components/superadmin/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { CustomersView } from "@/components/superadmin/customers-view";

const VALID_STATUSES: SubscriptionStatus[] = ["ACTIVE", "TRIAL", "EXPIRING", "EXPIRED"];

export default async function SuperAdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  const { session } = await requireSuperAdmin();
  const agent = await findUserByPhone(session.phone);

  const statusFilter = VALID_STATUSES.find((s) => s === status);
  const all = await getCustomers(q?.trim() || undefined);
  const customers = statusFilter ? all.filter((c) => c.status === statusFilter) : all;

  return (
    <>
      <Topbar title="مشتریان" agentName={agent?.fullName ?? "سوپرادمین"} />
      <PanelContent>
        <CustomersView customers={customers} q={q ?? ""} status={statusFilter} />
      </PanelContent>
    </>
  );
}
