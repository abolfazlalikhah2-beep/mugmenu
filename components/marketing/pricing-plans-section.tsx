import { PricingPlans } from "@/components/marketing/pricing-plans";

export function PricingPlansSection() {
  return (
    <section aria-labelledby="plans-heading" className="px-5 py-11">
      <h2 id="plans-heading" className="sr-only">
        پلن‌های اشتراک
      </h2>
      <div className="mx-auto max-w-[1160px]">
        <PricingPlans />
      </div>
    </section>
  );
}
