import Link from "next/link";
import { Plus } from "lucide-react";
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
      <Topbar
        title="مشتریان"
        agentName={agent?.fullName ?? "سوپرادمین"}
        action={
          <Link
            href="/superadmin/customers/new"
            className="flex h-[42px] items-center gap-1.5 rounded-xl bg-brand px-4 text-sm font-medium text-white"
          >
            <Plus size={17} />
            افزودن مشتری
          </Link>
        }
      />
      <PanelContent>
        <CustomersView customers={customers} q={q ?? ""} status={statusFilter} />
      </PanelContent>
    </>
  );
}
