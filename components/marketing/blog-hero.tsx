export function BlogHero({ defaultSearch }: { defaultSearch?: string }) {
  return (
    <section
      aria-labelledby="blog-heading"
      className="relative overflow-hidden bg-gradient-to-b from-[#f3faf4] to-white px-5 pb-9 pt-13"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-15 -top-22.5 h-80 w-80 rounded-full bg-brand opacity-12 blur-[44px]" />
      <div aria-hidden="true" className="pointer-events-none absolute top-10 -left-20 h-70 w-70 rounded-full bg-brand opacity-10 blur-[44px]" />

      <div className="relative mx-auto max-w-180 text-center">
        <span className="inline-flex items-center gap-2 rounded-pill border border-[#cfe6d2] bg-[#e9f4ea] px-4 py-1.75 text-sm font-medium text-brand">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 3h9l4 4v13a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M8 9h6M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          بلاگ سِرو
        </span>

        <h1
          id="blog-heading"
          className="mt-4.5 text-[clamp(1.6rem,3.6vw,2.4rem)] font-black leading-[1.4] tracking-[-0.5px] text-ink"
        >
          یاد بگیر، بفروش، رشد کن
        </h1>

        <p className="mx-auto mt-4 max-w-[46ch] text-[14px] font-light leading-[1.9] text-text-1">
          مقالاتی درباره مدیریت کافه و رستوران، بازاریابی و آموزش امکانات ماگ‌منو.
        </p>

        <form action="/blog" method="get" className="mx-auto mt-7 flex max-w-150 items-center gap-3 rounded-input border border-border-input bg-white py-1.5 pl-1.5 pr-4.5 shadow-float">
          <label htmlFor="blog-search" className="sr-only">
            جستجو در مقالات
          </label>
          <input
            id="blog-search"
            name="q"
            type="search"
            defaultValue={defaultSearch}
            placeholder="جستجو در مقالات..."
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
      </div>
    </section>
  );
}
