const reasons = [
  {
    title: "پشتیبانی پاسخگو",
    description: "تیم پشتیبانی فارسی‌زبان در هر مرحله کنار شماست تا کسب‌وکارتان بی‌وقفه بچرخد.",
    icon: (
      <>
        <path d="M4 13a8 8 0 0116 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <rect x="3" y="13" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <rect x="17" y="13" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M19 20a3 3 0 01-3 3h-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "امنیت بالا",
    description: "احراز هویت با کد پیامکی و نشست امن؛ داده‌های شما با دسترسی کنترل‌شده نگهداری می‌شوند.",
    icon: (
      <>
        <path d="M12 3l7 3v5c0 4.5-3 8.2-7 9.5C8 19.2 5 15.5 5 11V6z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    title: "طراحی بومی برای کسب‌وکار ایرانی",
    description: "زبان، تقویم و رابط کاربری کاملاً فارسی و راست‌به‌چپ، متناسب با نیاز کافه و رستوران ایرانی.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
        <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
  },
];

export function AboutWhyTrust() {
  return (
    <section aria-labelledby="why-trust-heading" className="mx-auto max-w-290 px-5 py-11.5">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-pill bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 3l7 3v5c0 4.5-3 8.2-7 9.5C8 19.2 5 15.5 5 11V6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
          اعتماد
        </span>
        <h2
          id="why-trust-heading"
          className="mt-4.5 text-[clamp(1.6rem,4vw,2.4rem)] font-bold leading-[1.4] tracking-[-0.4px] text-ink"
        >
          چرا به ماگ‌منو اعتماد کنیم؟
        </h2>
      </div>

      <div className="mt-10 grid gap-5.5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        {reasons.map((reason) => (
          <div key={reason.title} className="rounded-card-sm border border-[#e3efe4] bg-[#f6faf6] p-7">
            <span aria-hidden="true" className="flex h-13 w-13 items-center justify-center rounded-input bg-card text-brand shadow-float">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                {reason.icon}
              </svg>
            </span>
            <h3 className="mt-4.5 text-lg font-medium text-ink">{reason.title}</h3>
            <p className="mt-2.5 text-sm font-light leading-[1.9] text-text-1">{reason.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
