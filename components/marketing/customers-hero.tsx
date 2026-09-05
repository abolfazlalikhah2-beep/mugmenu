export function CustomersHero() {
  return (
    <section
      aria-labelledby="customers-heading"
      className="relative overflow-hidden bg-gradient-to-b from-[#f3faf4] to-white px-5 pb-5 pt-11"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-15 -top-22.5 h-80 w-80 rounded-full bg-brand opacity-12 blur-[44px]" />
      <div aria-hidden="true" className="pointer-events-none absolute top-10 -left-20 h-70 w-70 rounded-full bg-brand opacity-10 blur-[44px]" />

      <div className="relative mx-auto max-w-[54ch] text-center">
        <span className="inline-flex items-center gap-2 rounded-pill bg-brand/10 px-3.5 py-1.25 text-[13px] font-medium text-brand">
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l2.4 5 5.6.8-4 3.9 1 5.5-5-2.6-5 2.6 1-5.5-4-3.9 5.6-.8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
          مشتریان ما
        </span>

        <h1
          id="customers-heading"
          className="mt-4 text-[clamp(1.6rem,3.4vw,2.4rem)] font-bold leading-[1.4] tracking-[-0.3px] text-ink"
        >
          کسب‌وکارهایی که با سِرو رشد کرده‌اند
        </h1>

        <p className="mx-auto mt-3.5 max-w-[48ch] text-[14px] font-light leading-[1.9] text-text-1">
          رستوران‌ها و کافه‌هایی که همین حالا از منوی دیجیتال سِرو استفاده می‌کنند؛ به‌زودی اینجا معرفی می‌شوند.
        </p>
      </div>
    </section>
  );
}
