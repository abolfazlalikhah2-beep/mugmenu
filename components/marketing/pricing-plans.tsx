import { getAllPlans } from "@/features/plans/services/plan-service";
import { PricingPlansTabs, type PricingPlanCard } from "@/components/marketing/pricing-plans-tabs";

const EMOJI: Record<string, string> = {
  firuze: "💠",
  yashm: "💵",
  opal: "🧾",
  zomorrod: "🚀",
};

// Only opal (the flagship ordering tier) is highlighted — matches the
// comparison table's highlighted column below.
const RECOMMENDED_PLAN_KEY = "opal";
const FREE_TRIAL_PLAN_KEY = "firuze";

export async function PricingPlans() {
  const plans = await getAllPlans();

  const cards: PricingPlanCard[] = plans.map((plan) => ({
    key: plan.key,
    name: plan.name,
    description: plan.description ?? "",
    monthlyPrice: plan.monthlyPrice,
    sixMonthPrice: plan.sixMonthPrice,
    annualPrice: plan.annualPrice,
    marketingFeatures: plan.marketingFeatures,
    emoji: EMOJI[plan.key] ?? "✨",
    recommended: plan.key === RECOMMENDED_PLAN_KEY,
    freeTrial: plan.key === FREE_TRIAL_PLAN_KEY,
  }));

  return <PricingPlansTabs plans={cards} />;
}
