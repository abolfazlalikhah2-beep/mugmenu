import Link from "next/link";

const popularSearches = [
  { label: "ساخت منو", q: "منو" },
  { label: "کد QR", q: "qr" },
  { label: "سفارش بیرون‌بر", q: "بیرون‌بر" },
];

export function HelpHero({ defaultSearch }: { defaultSearch?: string }) {
  return (
    <section
      aria-labelledby="help-heading"
      className="relative overflow-hidden bg-gradient-to-b from-[#f3faf4] to-white px-5 pb-9 pt-13"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-15 -top-22.5 h-80 w-80 rounded-full bg-brand opacity-12 blur-[44px]" />
      <div aria-hidden="true" className="pointer-events-none absolute top-10 -left-20 h-70 w-70 rounded-full bg-brand opacity-10 blur-[44px]" />

      <div className="relative mx-auto max-w-180 text-center">
        <span className="inline-flex items-center gap-2 rounded-pill border border-[#cfe6d2] bg-[#e9f4ea] px-4 py-1.75 text-sm font-medium text-brand">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path d="M9.5 9.5a2.5 2.5 0 114 2c-.9.7-1.5 1.2-1.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="12" cy="17" r="0.9" fill="currentColor" />
          </svg>
          مرکز راهنما
        </span>

        <h1
          id="help-heading"
          className="mt-4.5 text-[clamp(1.6rem,3.6vw,2.4rem)] font-black leading-[1.4] tracking-[-0.5px] text-ink"
        >
          چطور می‌تونیم کمکت کنیم؟
        </h1>

        <p className="mx-auto mt-4 max-w-[46ch] text-[14px] font-light leading-[1.9] text-text-1">
          آموزش قدم‌به‌قدم همه امکانات سِرو
        </p>

        <form action="/help" method="get" className="mx-auto mt-7 flex max-w-150 items-center gap-3 rounded-input border border-border-input bg-white py-1.5 pl-1.5 pr-4.5 shadow-float">
          <label htmlFor="help-search" className="sr-only">
            جستجو در راهنما
          </label>
          <input
            id="help-search"
            name="q"
            type="search"
            defaultValue={defaultSearch}
            placeholder="مثلاً: ساخت QR کد میز"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-text-4"
          />
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0 text-text-3">
            <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
            <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <button
            type="submit"
            className="shrink-0 rounded-btn bg-brand px-5 py-2.75 text-sm font-semibold text-white shadow-[0_8px_9px_rgba(50,140,61,0.25)] transition-transform hover:scale-[1.02]"
          >
            جستجو
          </button>
        </form>

        <div className="mt-4.5 flex flex-wrap items-center justify-center gap-2 text-[13px] text-text-2">
          <span className="font-light">جستجوهای پرطرفدار:</span>
          {popularSearches.map((item) => (
            <Link
              key={item.label}
              href={`/help?q=${encodeURIComponent(item.q)}`}
              className="rounded-pill border border-border-line bg-chip px-3 py-1 text-text-1 transition-colors hover:border-brand/40 hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
