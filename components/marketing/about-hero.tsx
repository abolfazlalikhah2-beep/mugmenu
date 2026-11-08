export function AboutHero() {
  return (
    <section
      aria-labelledby="about-heading"
      className="relative overflow-hidden bg-gradient-to-b from-[#f3faf4] to-white px-5 pb-5 pt-13"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-15 -top-22.5 h-80 w-80 rounded-full bg-brand opacity-12 blur-[44px]" />
      <div aria-hidden="true" className="pointer-events-none absolute top-10 -left-20 h-70 w-70 rounded-full bg-brand opacity-10 blur-[44px]" />

      <div className="relative mx-auto max-w-180 text-center">
        <span className="inline-flex items-center gap-2 rounded-pill border border-[#cfe6d2] bg-[#e9f4ea] px-3 py-1.25 text-[13px] font-medium text-brand">
          درباره ما
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
            <path d="M2.5 19c0-3.3 2.9-5 6.5-5s6.5 1.7 6.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M15.5 4.3a3 3 0 010 5.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M18 19c0-2.6-1.8-4.1-4.2-4.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>

        <h1
          id="about-heading"
          className="mt-4.5 text-[clamp(1.5rem,3.2vw,2.2rem)] font-bold leading-[1.3] tracking-[-0.5px] text-ink"
        >
          ما سرو رو ساختیم تا سفارش‌گیری ساده‌تر بشه
        </h1>

        <p className="mx-auto mt-4 max-w-[48ch] text-[14px] font-light leading-[1.9] text-text-1">
          تیمی کوچک از قم، با یک هدف بزرگ: دیجیتال کردن تجربه سفارش در کافه‌ها و رستوران‌های ایران.
        </p>
      </div>
    </section>
  );
}
