import Link from "next/link";

const orderRows = [
  { code: "۵۱", label: "میز ۳ · ۲ آیتم", status: "جدید", tone: "text-[#2f7fd6] bg-[#2f7fd6]/12" },
  { code: "۵۰", label: "بیرون‌بر · ۴ آیتم", status: "در حال آماده‌سازی", tone: "text-[#c98a12] bg-[#c98a12]/14" },
  { code: "۴۹", label: "میز ۷ · ۳ آیتم", status: "آماده تحویل", tone: "text-brand bg-brand/12" },
];

const panelFeatures = [
  {
    title: "اعلان لحظه‌ای سفارش",
    description: "هر سفارش جدید در همان لحظه روی پنل نمایش داده می‌شود.",
    icon: (
      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
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
    title: "گزارش سفارش‌ها و فروش",
    description: "روند فروش روزانه را در یک نگاه در پنل مدیریت ببینید.",
    icon: (
      <path d="M4 20V5M4 20h16M8 16l3.5-4 3 2.4L20 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
];

export function AdminPanelSection() {
  return (
    <section
      aria-labelledby="admin-panel-heading"
      className="relative overflow-hidden bg-gradient-to-b from-white to-[#f3faf4]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-25 -right-17.5 h-80 w-80 rounded-full bg-brand opacity-10 blur-[44px]" />

      <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-5 py-17.5 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
        <div className="relative flex min-h-105 items-end justify-center">
          <DashboardPreview />
        </div>

        <div>
          <span className="inline-flex items-center gap-2 rounded-pill bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            پنل مدیریت
          </span>

          <h2
            id="admin-panel-heading"
            className="mt-4.5 text-[clamp(1.6rem,4vw,2.5rem)] font-bold leading-[1.4] tracking-[-0.4px] text-ink"
          >
            پنل مدیریت رستوران؛ از موبایل، تبلت یا لپ‌تاپ
          </h2>

          <p className="mt-4 max-w-[44ch] text-[clamp(1rem,2.1vw,1.15rem)] font-light leading-[2] text-text-1">
            بدون نصب هیچ برنامه‌ای، تنها با مرورگر هر دستگاهی به پنل مدیریت
            ماگ‌منو دسترسی دارید و رستوران‌تان را از هر جا مدیریت می‌کنید.
          </p>

          <div className="mt-6.5 flex flex-col gap-4">
            {panelFeatures.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3.25">
                <span aria-hidden="true" className="flex h-10 w-10 flex-none items-center justify-center rounded-input bg-brand/10 text-brand">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

          <Link
            href="/register"
            className="mt-7.5 inline-block rounded-btn bg-brand px-7.5 py-3.5 text-base font-medium text-white shadow-[0_8px_17.5px_rgba(50,140,61,0.28)] transition-colors hover:bg-brand-hover"
          >
            مشاهده دمو پنل
          </Link>
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div
      role="img"
      aria-label="پیش‌نمایش پنل مدیریت ماگ‌منو روی لپ‌تاپ، شامل تعداد سفارش و درآمد امروز و لیست سفارش‌های میز و بیرون‌بر با وضعیت هرکدام"
      className="w-full max-w-130"
    >
      <div className="rounded-t-[22px] rounded-b-[8px] bg-[#0e120f] p-3 pb-3.5 shadow-[0_26px_41px_rgba(0,0,0,0.12)]">
        <div className="overflow-hidden rounded-xl bg-[#f7faf7]">
          <div className="flex items-center justify-between border-b border-[#eef1ee] bg-white px-3.5 py-2.75">
            <div className="flex items-center gap-2">
              <div className="flex h-6.5 w-6.5 items-center justify-center rounded-[9px] bg-brand">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M4 13.5C4 9 7.5 5.5 12 5.5S20 9 20 13.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M3 13.5h18M6.5 17.5h11" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-xs font-medium">پنل پیتزا رومینا</span>
            </div>
            <span className="text-[10.5px] text-[#8a938d]">داشبورد</span>
          </div>

          <div className="grid grid-cols-2 gap-2.25 px-3.25 pb-1.5 pt-3.25">
            <div className="rounded-2xl border border-[#eef1ee] bg-white px-3.25 py-3">
              <div className="flex items-center gap-1.75 text-[11px] text-[#8a938d]">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand/12 text-brand">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M4 6h2l2 11h9l2-8H7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                سفارش امروز
              </div>
              <div className="mt-2 text-xl font-bold text-ink">۱۴۸</div>
            </div>
            <div className="rounded-2xl border border-[#eef1ee] bg-white px-3.25 py-3">
              <div className="flex items-center gap-1.75 text-[11px] text-[#8a938d]">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand/12 text-brand">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M4 20V5M4 20h16M8 16l3.5-4 3 2.4L20 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                درآمد امروز
              </div>
              <div className="mt-2 text-xl font-bold text-brand">
                ۸٫۴ <span className="text-[11px] font-normal text-[#8a938d]">م تومان</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 px-3.25 pb-4 pt-1.5">
            {orderRows.map((row) => (
              <div
                key={row.code}
                className="flex items-center justify-between rounded-[13px] border border-[#eef1ee] bg-white px-2.75 py-2.25"
              >
                <div className="flex items-center gap-2.25">
                  <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-brand/12 text-[11px] font-bold text-brand">
                    {row.code}
                  </div>
                  <span className="text-xs font-medium">{row.label}</span>
                </div>
                <span className={`rounded-full px-2.25 py-1 text-[10.5px] ${row.tone}`}>{row.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto h-3.25 w-3/4 rounded-b-xl bg-gradient-to-b from-[#c7cdc8] to-[#aab1ab]" />
    </div>
  );
}
