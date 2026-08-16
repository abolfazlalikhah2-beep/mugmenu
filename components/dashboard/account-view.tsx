import { PlanCard } from "@/components/dashboard/plan-card";
import { PlanFeaturesCard } from "@/components/dashboard/plan-features-card";
import { BillingPlaceholderCard } from "@/components/dashboard/billing-placeholder-card";
import type { PlanStatus } from "@/features/dashboard/services/plan-status";

export function AccountView({
  planName,
  priceToman,
  expiresAt,
  maxUsers,
  status,
  featureLabels,
}: {
  planName: string;
  priceToman: number;
  expiresAt: Date;
  maxUsers: number;
  status: PlanStatus;
  featureLabels: string[];
}) {
  return (
    <div className="grid h-full items-start gap-[18px] sm:gap-[24px] lg:grid-cols-[1.3fr_1fr]">
      <PlanCard planName={planName} priceToman={priceToman} expiresAt={expiresAt} status={status} />
      <div className="flex flex-col gap-[18px] sm:gap-[22px]">
        <PlanFeaturesCard maxUsers={maxUsers} featureLabels={featureLabels} />
        <BillingPlaceholderCard />
      </div>
    </div>
  );
}
