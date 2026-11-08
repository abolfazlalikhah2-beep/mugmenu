import Link from "next/link";

export function HelpSupport() {
  return (
    <section aria-labelledby="help-support-heading" className="px-5 py-10">
      <div className="mx-auto max-w-[1200px] rounded-card-sm border border-border-line bg-card px-6 py-11 text-center shadow-float">
        <span aria-hidden="true" className="mx-auto flex size-12 items-center justify-center rounded-pill bg-[#eaf6ec] text-brand">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 13a8 8 0 0116 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            <rect x="3" y="13" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.7" />
            <rect x="17" y="13" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.7" />
          </svg>
        </span>

        <h2 id="help-support-heading" className="mt-4 text-lg font-extrabold text-ink sm:text-xl">
          جوابت رو پیدا نکردی؟
        </h2>
        <p className="mt-2 text-[13.5px] font-light text-text-2">تیم پشتیبانی سِرو از ساعت ۹ تا ۱۸ آماده کمک است.</p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/faq"
            className="rounded-btn border border-border-input bg-white px-5 py-2.75 text-sm font-semibold text-ink transition-colors hover:border-brand/40"
          >
            سوالات متداول
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-btn bg-brand px-5 py-2.75 text-sm font-semibold text-white shadow-[0_8px_9px_rgba(50,140,61,0.25)] transition-transform hover:scale-[1.02]"
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.7A2 2 0 014.2 2h3a2 2 0 012 1.7c.1 1 .3 2 .7 3a2 2 0 01-.4 2.1L8.1 10a16 16 0 006 6l1.2-1.4a2 2 0 012.1-.4c1 .3 2 .5 3 .7a2 2 0 011.7 2.1z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
            تماس با پشتیبانی
          </Link>
        </div>
      </div>
    </section>
  );
}
