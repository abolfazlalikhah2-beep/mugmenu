const features = [
  {
    title: "منوی عمومی سریع و زیبا",
    description: "منوی دیجیتال با بارگذاری آنی و طراحی تمیز برای هر رستوران.",
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="3" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "سه حالت سفارش هوشمند",
    description: "سفارش روی میز، بیرون‌بر و ارسال با پیک در یک سیستم واحد.",
    icon: (
      <>
        <path d="M4 6h2l2 11h9l2-8H7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="20" r="1.3" fill="currentColor" />
        <circle cx="16" cy="20" r="1.3" fill="currentColor" />
      </>
    ),
  },
  {
    title: "پنل مدیریت کامل",
    description: "همه‌چیز از سفارش تا محصولات و گزارش‌ها در یک داشبورد.",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "مدیریت محصولات با آپلود عکس",
    description: "آیتم‌ها، دسته‌ها، قیمت و عکس هر محصول را در لحظه ویرایش کنید.",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M3 15l4.5-4 3.5 3 3.5-4L21 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="9.5" r="1.4" fill="currentColor" />
      </>
    ),
  },
  {
    title: "اعلان لحظه‌ای سفارش",
    description: "هر سفارش جدید در همان لحظه روی پنل نمایش داده می‌شود.",
    icon: (
      <>
        <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.7 21a2 2 0 01-3.4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "گزارش‌گیری و آمار فروش",
    description: "روند فروش روزانه و پرفروش‌ترین آیتم‌ها را در یک نگاه ببینید.",
    icon: (
      <path d="M4 20V5M4 20h16M8 16l3.5-4 3 2.4L20 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "امنیت بالا",
    description: "احراز هویت با کد پیامکی و نشست امن، بدون نیاز به رمز قابل حدس.",
    icon: (
      <path d="M12 3l7 3v5c0 4.5-3 8.2-7 9.5C8 19.2 5 15.5 5 11V6z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    ),
  },
  {
    title: "پشتیبانی ۲۴ ساعته",
    description: "تیم پشتیبانی فارسی‌زبان ماگ‌منو در تمام ساعات شبانه‌روز پاسخگوی شماست.",
    icon: (
      <>
        <path d="M4 13a8 8 0 0116 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <rect x="3" y="13" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <rect x="17" y="13" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.7" />
      </>
    ),
  },
];

export function FeaturesGrid() {
  return (
    <section aria-labelledby="features-heading" id="features" className="relative bg-[#f7faf7] px-5 py-17.5">
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-[52ch] text-center">
          <span className="inline-flex items-center gap-2 rounded-pill bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 3l2.5 5.2L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            امکانات
          </span>
          <h2
            id="features-heading"
            className="mx-auto mt-4.5 max-w-[22ch] text-[clamp(1.6rem,4vw,2.5rem)] font-bold leading-[1.4] tracking-[-0.4px] text-ink"
          >
            هر چیزی که برای منوی دیجیتال و مدیریت رستوران لازم دارید
          </h2>
        </div>

        <div className="mt-11 grid gap-4.5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-3.5 rounded-card-sm border border-border-line bg-card p-5.5 shadow-float transition-shadow hover:shadow-modal"
            >
              <span aria-hidden="true" className="flex h-12 w-12 flex-none items-center justify-center rounded-input bg-brand/10 text-brand">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  {feature.icon}
                </svg>
              </span>
              <div className="leading-[1.7]">
                <div className="text-base font-medium text-ink">{feature.title}</div>
                <div className="text-sm font-light text-text-1">{feature.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
