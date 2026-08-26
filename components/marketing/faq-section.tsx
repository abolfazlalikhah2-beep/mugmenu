import { FaqAccordion } from "@/components/marketing/faq-accordion";

export function FaqSection() {
  return (
    <section aria-labelledby="faq-heading" id="faq" className="relative mx-auto max-w-205 px-5 py-17.5">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-pill bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path d="M9.5 9.5a2.5 2.5 0 114 2c-.9.7-1.5 1.2-1.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="12" cy="17" r="0.9" fill="currentColor" />
          </svg>
          سوالات متداول
        </span>
        <h2
          id="faq-heading"
          className="mt-4.5 text-[clamp(1.6rem,4vw,2.5rem)] font-bold leading-[1.4] tracking-[-0.4px] text-ink"
        >
          پاسخ سوالات شما
        </h2>
      </div>

      <div className="mt-10">
        <FaqAccordion />
      </div>
    </section>
  );
}
