const steps = [
  {
    title: "منو را در چند دقیقه بسازید",
    description: "آیتم‌ها، دسته‌ها و قیمت‌ها را وارد کنید و کد QR اختصاصی خود را بگیرید.",
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="3" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "مشتری اسکن و سفارش می‌دهد",
    description: "بدون نصب اپ، منو در مرورگر باز می‌شود و سفارش ثبت می‌شود.",
    icon: (
      <>
        <path d="M4 8V6a2 2 0 012-2h2M20 8V6a2 2 0 00-2-2h-2M4 16v2a2 2 0 002 2h2M20 16v2a2 2 0 01-2 2h-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M4 12h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "شما مدیریت و رشد می‌دهید",
    description: "سفارش‌ها را در پنل مدیریت کنید و با گزارش‌ها تصمیم بهتری بگیرید.",
    icon: (
      <path d="M4 20V5M4 20h16M8 16l3.5-4 3 2.4L20 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
];

export function AboutHowWeWork() {
  return (
    <section aria-labelledby="how-we-work-heading" className="mx-auto max-w-290 px-5 py-11.5">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-pill bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M13 3L4 14h6l-1 7 9-11h-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          روش کار
        </span>
        <h2
          id="how-we-work-heading"
          className="mt-4.5 text-[clamp(1.4rem,2.8vw,1.9rem)] font-bold leading-[1.4] tracking-[-0.4px] text-ink"
        >
          چطور کار می‌کنیم؟
        </h2>
      </div>

      <div className="mt-10 grid gap-5.5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        {steps.map((step) => (
          <div key={step.title} className="rounded-card-sm border border-border-line bg-card p-7 shadow-float">
            <span aria-hidden="true" className="flex h-13 w-13 items-center justify-center rounded-input bg-brand/10 text-brand">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                {step.icon}
              </svg>
            </span>
            <h3 className="mt-4.5 text-lg font-medium text-ink">{step.title}</h3>
            <p className="mt-2.5 text-sm font-light leading-[1.9] text-text-1">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
