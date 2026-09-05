import Link from "next/link";

export function CtaSection() {
  return (
    <section aria-labelledby="cta-heading" className="relative overflow-hidden px-5 py-17.5">
      <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-card bg-gradient-to-br from-brand to-[#1f5c26] px-6 py-14 text-center sm:px-14">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-70 w-70 rounded-full bg-white opacity-8 blur-[54px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-16 h-70 w-70 rounded-full bg-white opacity-8 blur-[54px]" />

        <span className="relative inline-flex items-center gap-2 rounded-pill bg-white/16 px-4 py-1.5 text-sm font-medium text-white">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l2.4 5 5.6.8-4 3.9 1 5.5-5-2.6-5 2.6 1-5.5-4-3.9 5.6-.8z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
          ۱ ماه اشتراک رایگان
        </span>

        <h2
          id="cta-heading"
          className="relative mx-auto mt-5 max-w-[22ch] text-[clamp(1.45rem,3vw,2rem)] font-bold leading-[1.4] tracking-[-0.4px] text-white"
        >
          همین امروز رستوران‌تان را دیجیتال کنید
        </h2>
        <p className="relative mx-auto mt-4 max-w-[46ch] text-[14px] font-light leading-[1.9] text-white/85">
          ۱ ماه رایگان، بدون نیاز به کارت بانکی
        </p>

        <Link
          href="/register"
          className="relative mt-8 inline-block rounded-btn bg-white px-9 py-3.75 text-base font-medium text-brand shadow-[0_8px_20px_rgba(0,0,0,0.16)] transition-transform hover:scale-[1.03]"
        >
          شروع رایگان
        </Link>

        <div className="relative mt-5.5 flex flex-wrap items-center justify-center gap-x-6.5 gap-y-3">
          <span className="inline-flex items-center gap-2 text-sm font-light text-white/90">
            <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            بدون نیاز به کارت بانکی
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-light text-white/90">
            <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            لغو در هر زمان
          </span>
        </div>
      </div>
    </section>
  );
}
