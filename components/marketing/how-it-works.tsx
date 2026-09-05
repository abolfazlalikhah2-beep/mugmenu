const steps = [
  {
    number: "۱",
    title: "QR اختصاصی بسازید",
    description: "برای هر شعبه یا میز یک QR اختصاصی بسازید.",
    icon: (
      <>
        <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M13 13h3v3M20 16v4M16 20h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
  },
  {
    number: "۲",
    title: "مشتری اسکن می‌کند",
    description: "بدون نصب اپ، منو در مرورگر باز می‌شود.",
    icon: (
      <>
        <path d="M4 8V6a2 2 0 012-2h2M20 8V6a2 2 0 00-2-2h-2M4 16v2a2 2 0 002 2h2M20 16v2a2 2 0 01-2 2h-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M4 12h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
  },
  {
    number: "۳",
    title: "سفارش را انتخاب می‌کند",
    description: "روی میز، بیرون‌بر یا ارسال با پیک.",
    icon: (
      <>
        <path d="M4 6h2l2.2 10.4a1.5 1.5 0 001.5 1.2h7.1a1.5 1.5 0 001.5-1.1L20.5 9H7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="20.5" r="1.2" fill="currentColor" />
        <circle cx="17" cy="20.5" r="1.2" fill="currentColor" />
      </>
    ),
  },
  {
    number: "۴",
    title: "سفارش لحظه‌ای به پنل می‌رسد",
    description: "اعلان آنی روی داشبورد نمایش داده می‌شود.",
    icon: (
      <>
        <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.7 21a2 2 0 01-3.4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
  },
  {
    number: "۵",
    title: "مدیریت و گزارش‌گیری",
    description: "محصولات، دسته‌بندی و گزارش فروش در یک پنل.",
    icon: (
      <>
        <path d="M4 20V5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M4 20h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M8 16l3.5-4 3 2.4L20 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works-heading" className="relative mx-auto max-w-[1200px] px-5 py-13.5">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-pill bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M13 3L4 14h6l-1 7 9-11h-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          نحوه کار سِرو
        </span>
        <h2
          id="how-it-works-heading"
          className="mx-auto mt-4.5 max-w-[20ch] text-[clamp(1.4rem,2.8vw,1.9rem)] font-bold leading-[1.4] tracking-[-0.4px] text-ink"
        >
          از اسکن مشتری تا رسیدن سفارش؛ فقط چند ثانیه
        </h2>
      </div>

      <ol className="relative mt-13 flex flex-col gap-7 md:flex-row md:gap-2.5">
        <div aria-hidden="true" className="absolute inset-x-[10%] top-7.25 hidden h-0.5 bg-[#d8ecda] md:block" />
        <div aria-hidden="true" className="absolute bottom-7 right-7.25 top-7 w-0.5 bg-[#d8ecda] md:hidden" />

        {steps.map((step) => (
          <li key={step.number} className="relative z-10 flex flex-1 items-start gap-4 md:flex-col md:items-center md:text-center">
            <div className="relative flex-none">
              <div className="flex h-14.5 w-14.5 items-center justify-center rounded-full border-2 border-brand bg-card text-brand shadow-[0_8px_17.5px_rgba(50,140,61,0.14)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  {step.icon}
                </svg>
              </div>
              <span
                aria-hidden="true"
                className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-brand text-xs font-bold text-white"
              >
                {step.number}
              </span>
            </div>
            <div className="leading-[1.7]">
              <div className="text-base font-medium text-ink">{step.title}</div>
              <div className="text-sm font-light text-text-1">{step.description}</div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
