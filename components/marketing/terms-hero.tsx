import { termsLastUpdated } from "@/components/marketing/terms-data";

export function TermsHero() {
  return (
    <section
      aria-labelledby="terms-page-heading"
      className="relative overflow-hidden bg-gradient-to-b from-[#f3faf4] to-white px-5 pb-9 pt-13"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-15 -top-22.5 h-80 w-80 rounded-full bg-brand opacity-12 blur-[44px]" />
      <div aria-hidden="true" className="pointer-events-none absolute top-10 -left-20 h-70 w-70 rounded-full bg-brand opacity-10 blur-[44px]" />

      <div className="relative mx-auto max-w-150 text-center">
        <span className="inline-flex items-center gap-2 rounded-pill bg-brand/10 px-4 py-1.75 text-sm font-medium text-brand">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 4.5h10a1.5 1.5 0 011.5 1.5v12a1.5 1.5 0 01-1.5 1.5H7A1.5 1.5 0 015.5 18V6A1.5 1.5 0 017 4.5z"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path d="M8.5 9h7M8.5 12.5h7M8.5 16h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          قوانین
        </span>

        <h1
          id="terms-page-heading"
          className="mt-4.5 text-[clamp(1.5rem,3.2vw,2.2rem)] font-bold leading-[1.3] tracking-[-0.5px] text-ink"
        >
          قوانین و مقررات
        </h1>

        <p className="mx-auto mt-4 max-w-[48ch] text-[14px] font-light leading-[1.9] text-text-1">
          آخرین بازبینی: {termsLastUpdated}
        </p>
      </div>
    </section>
  );
}
