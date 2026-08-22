import { requireSuperAdmin } from "@/features/auth/services/authorize";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
import { getRequestRows } from "@/features/payments/services/payment-service";
import { getPlansForPicker } from "@/features/superadmin/services/customer-service";
import type { PaymentRequestStatus } from "@/lib/generated/prisma/enums";
import { Topbar } from "@/components/superadmin/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { PaymentRequestsView } from "@/components/superadmin/payment-requests-view";

const VALID_STATUSES: PaymentRequestStatus[] = ["PENDING", "VERIFIED", "REJECTED"];

export default async function SuperAdminPaymentRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const { session } = await requireSuperAdmin();
  const statusFilter = VALID_STATUSES.find((s) => s === status);

  const [agent, requests, plans] = await Promise.all([
    findUserByPhone(session.phone),
    getRequestRows({ status: statusFilter }),
    getPlansForPicker(),
  ]);

  return (
    <>
      <Topbar title="درخواست‌های پرداخت" agentName={agent?.fullName ?? "سوپرادمین"} />
      <PanelContent>
        <PaymentRequestsView
          requests={requests}
          plans={plans.map((p) => ({ id: p.id, name: p.name }))}
          status={statusFilter}
        />
      </PanelContent>
    </>
  );
}
