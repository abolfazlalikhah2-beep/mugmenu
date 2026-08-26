export function AboutHero() {
  return (
    <section
      aria-labelledby="about-heading"
      className="relative overflow-hidden bg-gradient-to-b from-[#f3faf4] to-white px-5 pb-5 pt-13"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-15 -top-22.5 h-80 w-80 rounded-full bg-brand opacity-12 blur-[44px]" />
      <div aria-hidden="true" className="pointer-events-none absolute top-10 -left-20 h-70 w-70 rounded-full bg-brand opacity-10 blur-[44px]" />

      <div className="relative mx-auto max-w-205 text-center">
        <span className="inline-flex items-center gap-2 rounded-pill bg-brand/10 px-4 py-1.75 text-sm font-medium text-brand">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.7" />
            <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          درباره ما
        </span>

        <h1
          id="about-heading"
          className="mt-4.5 text-[clamp(2rem,5vw,3.2rem)] font-bold leading-[1.3] tracking-[-0.5px] text-ink"
        >
          ماگ‌منو کنار رستوران شماست
        </h1>

        <p className="mx-auto mt-4 max-w-[52ch] text-[clamp(1rem,2.1vw,1.18rem)] font-light leading-[2] text-text-1">
          ما ماگ‌منو را ساختیم تا مدیریت منو و سفارش برای رستوران‌ها و کافه‌های ایرانی ساده، سریع و بدون دردسر شود.
        </p>
      </div>
    </section>
  );
}
