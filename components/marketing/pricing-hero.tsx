export function PricingHero() {
  return (
    <section
      aria-labelledby="pricing-heading"
      className="relative overflow-hidden bg-gradient-to-b from-[#f3faf4] to-white px-5 pb-5 pt-13"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-15 -top-22.5 h-80 w-80 rounded-full bg-brand opacity-12 blur-[44px]" />
      <div aria-hidden="true" className="pointer-events-none absolute top-10 -left-20 h-70 w-70 rounded-full bg-brand opacity-10 blur-[44px]" />

      <div className="relative mx-auto max-w-[48ch] text-center">
        <span className="inline-flex items-center gap-2 rounded-pill bg-brand/10 px-4 py-1.75 text-sm font-medium text-brand">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M20 12l-8 8-8-8V4h8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <circle cx="16" cy="8" r="1.4" fill="currentColor" />
          </svg>
          اشتراک
        </span>

        <h1
          id="pricing-heading"
          className="mt-4.5 text-[clamp(1.5rem,3.2vw,2.2rem)] font-bold leading-[1.3] tracking-[-0.5px] text-ink"
        >
          اشتراک‌ها و تعرفه‌ها
        </h1>

        <p className="mx-auto mt-4 max-w-[48ch] text-[14px] font-light leading-[1.9] text-text-1">
          پلنی متناسب با اندازه‌ی رستوران‌تان انتخاب کنید و هر زمان خواستید ارتقا دهید.
        </p>
      </div>
    </section>
  );
}
