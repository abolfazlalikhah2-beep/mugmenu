export function CustomersHero() {
  return (
    <section
      aria-labelledby="customers-heading"
      className="relative overflow-hidden bg-gradient-to-b from-[#f3faf4] to-white px-5 pb-5 pt-13"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-15 -top-22.5 h-80 w-80 rounded-full bg-brand opacity-12 blur-[44px]" />
      <div aria-hidden="true" className="pointer-events-none absolute top-10 -left-20 h-70 w-70 rounded-full bg-brand opacity-10 blur-[44px]" />

      <div className="relative mx-auto max-w-[54ch] text-center">
        <span className="inline-flex items-center gap-1.5 rounded-pill border border-[#cfe6d2] bg-brand/10 px-3 py-1.25 text-[13px] font-medium text-brand">
          مشتریان
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 21s-7.5-4.7-10.1-8.9C.3 8.6 2 4.6 6 4a5.3 5.3 0 016 2.4A5.3 5.3 0 0118 4c4 .6 5.7 4.6 4.1 8.1C19.5 16.3 12 21 12 21z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </span>

        <h1
          id="customers-heading"
          className="mt-4.5 text-[clamp(1.5rem,3.2vw,2.2rem)] font-bold leading-[1.3] tracking-[-0.5px] text-ink"
        >
          کسب‌وکارهایی که با سرو خوشمزه‌تر شدند
        </h1>

        <p className="mx-auto mt-4 max-w-[48ch] text-[14px] font-light leading-[1.9] text-text-1">
          بیش از ۱۲۰ کافه، رستوران و فست‌فود در سراسر ایران از سرو استفاده می‌کنند.
        </p>
      </div>
    </section>
  );
}
