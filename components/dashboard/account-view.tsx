import { PlanCard } from "@/components/dashboard/plan-card";
import { PlanFeaturesCard } from "@/components/dashboard/plan-features-card";
import { PaymentRequestsCard } from "@/components/dashboard/payment-requests-card";
import type { PlanStatus } from "@/features/dashboard/services/plan-status";
import type { BusinessPaymentRequestRow } from "@/features/payments/services/payment-service";

export function AccountView({
  billingCycle,
  planName,
  priceToman,
  expiresAt,
  maxUsers,
  status,
  featureLabels,
  paymentRequests,
}: {
  billingCycle: "MONTHLY" | "SIX_MONTH" | "ANNUAL";
  planName: string;
  priceToman: number;
  expiresAt: Date;
  maxUsers: number;
  status: PlanStatus;
  featureLabels: string[];
  paymentRequests: BusinessPaymentRequestRow[];
}) {
  return (
    <div className="grid h-full items-start gap-[18px] sm:gap-[24px] lg:grid-cols-[1.3fr_1fr]">
      <PlanCard
        billingCycle={billingCycle}
        planName={planName}
        priceToman={priceToman}
        expiresAt={expiresAt}
        status={status}
      />
      <div className="flex flex-col gap-[18px] sm:gap-[22px]">
        <PlanFeaturesCard maxUsers={maxUsers} featureLabels={featureLabels} />
        <PaymentRequestsCard requests={paymentRequests} />
      </div>
    </div>
  );
}
