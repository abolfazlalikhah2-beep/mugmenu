import { PricingPlans } from "@/components/marketing/pricing-plans";

export function PricingSection() {
  return (
    <section aria-labelledby="pricing-heading" id="pricing" className="relative overflow-hidden bg-gradient-to-b from-white to-[#f3faf4] px-5 py-17.5">
      <div aria-hidden="true" className="pointer-events-none absolute -left-17.5 top-10 h-75 w-75 rounded-full bg-brand opacity-10 blur-[44px]" />

      <div className="relative mx-auto max-w-[1160px]">
        <div className="mx-auto max-w-[24ch] text-center">
          <span className="inline-flex items-center gap-2 rounded-pill bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M20 12l-8 8-8-8V4h8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <circle cx="16" cy="8" r="1.4" fill="currentColor" />
            </svg>
            اشتراک
          </span>
          <h2
            id="pricing-heading"
            className="mt-4.5 text-[clamp(1.4rem,2.8vw,1.9rem)] font-bold leading-[1.4] tracking-[-0.4px] text-ink"
          >
            پلن مناسب کسب‌وکارتان را انتخاب کنید، هر وقت نیاز داشتید ارتقا دهید
          </h2>
        </div>

        <div className="mt-6.5">
          <PricingPlans />
        </div>
      </div>
    </section>
  );
}
