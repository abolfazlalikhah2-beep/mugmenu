import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { getCreditRecords } from "@/features/credits/services/credit-service";
import { businessHasFeature } from "@/features/plans/services/plan-service";
import { parseDateRangeParams } from "@/features/dashboard/services/date-range-filter";
import type { CreditStatus } from "@/lib/generated/prisma/enums";
import { Topbar } from "@/components/dashboard/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { CreditsView } from "@/components/dashboard/credits-view";
import { UpgradeGate } from "@/components/dashboard/upgrade-gate";

const VALID_STATUSES: CreditStatus[] = ["UNPAID", "PARTIAL", "PAID"];

export default async function CreditsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; from?: string; to?: string }>;
}) {
  const { status, from, to } = await searchParams;
  const { businessId } = await requireBusinessOwner();
  const statusFilter = VALID_STATUSES.find((s) => s === status);
  const dateRange = parseDateRangeParams({ from, to });

  const [business, allowed] = await Promise.all([
    getBusiness(businessId),
    businessHasFeature(businessId, "order.manual_entry"),
  ]);
  if (!business) return null;

  const records = allowed ? await getCreditRecords(businessId, statusFilter, dateRange ?? undefined) : [];

  return (
    <>
      <Topbar title="نسیه" businessName={business.name} />
      <PanelContent>
        <UpgradeGate allowed={allowed} title="ثبت نسیه در پلن شما موجود نیست">
          <CreditsView records={records} status={statusFilter} from={from} to={to} dateRange={dateRange} />
        </UpgradeGate>
      </PanelContent>
    </>
  );
}
