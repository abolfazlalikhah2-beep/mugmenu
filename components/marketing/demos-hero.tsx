export function DemosHero() {
  return (
    <section
      aria-labelledby="demos-heading"
      className="relative overflow-hidden bg-gradient-to-b from-[#f3faf4] to-white px-5 pb-5 pt-13"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-15 -top-22.5 h-80 w-80 rounded-full bg-brand opacity-12 blur-[44px]" />
      <div aria-hidden="true" className="pointer-events-none absolute top-10 -left-20 h-70 w-70 rounded-full bg-brand opacity-10 blur-[44px]" />

      <div className="relative mx-auto max-w-[54ch] text-center">
        <span className="inline-flex items-center gap-2 rounded-pill bg-brand/10 px-4 py-1.75 text-sm font-medium text-brand">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="3" width="16" height="18" rx="3" stroke="currentColor" strokeWidth="1.7" />
            <path d="M9 4.5v-1M15 4.5v-1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            <path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          دموها
        </span>

        <h1
          id="demos-heading"
          className="mt-4.5 text-[clamp(2rem,5vw,3.2rem)] font-bold leading-[1.3] tracking-[-0.5px] text-ink"
        >
          منوی ماگ‌منو را از نزدیک ببینید
        </h1>

        <p className="mx-auto mt-4 max-w-[48ch] text-[clamp(1rem,2.1vw,1.18rem)] font-light leading-[2] text-text-1">
          چند نمونه‌ی واقعی از منوی دیجیتال ماگ‌منو برای انواع کسب‌وکار؛ روی هر کدام بزنید و تجربه‌ی زنده را ببینید.
        </p>
      </div>
    </section>
  );
}
