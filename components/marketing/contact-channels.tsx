import Link from "next/link";

const stats = [
  {
    label: "میانگین پاسخ ایمیل",
    value: "کمتر از ۴ ساعت",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.7" />
        <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    label: "میانگین پاسخ چت",
    value: "کمتر از ۵ دقیقه",
    icon: <path d="M4 5h16v11H9l-4 3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />,
  },
  {
    label: "ساعات پاسخگویی",
    value: "۹ صبح تا ۱۲ شب",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
];

export function ContactChannels() {
  return (
    <section aria-label="راه‌های ارتباط با سِرو" className="mx-auto max-w-[1160px] px-5 py-6">
      <div className="grid gap-5.5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
        <div className="flex flex-col rounded-card border border-border-line bg-card p-7.5 shadow-float transition-shadow hover:shadow-modal">
          <span className="self-start rounded-pill bg-brand/10 px-3 py-1.25 text-xs font-medium text-brand">ارتباط رسمی</span>
          <span aria-hidden="true" className="mt-4.5 flex h-14 w-14 items-center justify-center rounded-input bg-brand/10 text-brand">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.7" />
              <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h2 className="mt-4.5 text-lg font-bold text-ink">ایمیل</h2>
          <p className="mt-2 flex-1 text-sm font-light leading-[2] text-text-1">
            برای درخواست‌های رسمی و همکاری، از طریق ایمیل با ما مکاتبه کنید.
          </p>
          <div dir="ltr" className="mt-3.5 text-end text-[15px] font-medium text-brand">
            support@mugmenu.ir
          </div>
          <a
            href="mailto:support@mugmenu.ir"
            className="mt-4.5 inline-flex items-center justify-center rounded-input bg-brand px-4 py-3.25 text-[15px] font-medium text-white shadow-[0_8px_17.5px_rgba(50,140,61,0.28)] transition-colors hover:bg-brand-hover"
          >
            ارسال ایمیل
          </a>
        </div>

        <div className="flex flex-col rounded-card border border-border-line bg-card p-7.5 shadow-float transition-shadow hover:shadow-modal">
          <span className="self-start rounded-pill bg-brand/10 px-3 py-1.25 text-xs font-medium text-brand">پیگیری رسمی</span>
          <span aria-hidden="true" className="mt-4.5 flex h-14 w-14 items-center justify-center rounded-input bg-brand/10 text-brand">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 8a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2a2 2 0 000-4z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path d="M13 6v12" stroke="currentColor" strokeWidth="1.7" strokeDasharray="2 3" />
            </svg>
          </span>
          <h2 className="mt-4.5 text-lg font-bold text-ink">تیکت پشتیبانی</h2>
          <p className="mt-2 flex-1 text-sm font-light leading-[2] text-text-1">
            از داخل پنل مدیریت تیکت ثبت کنید تا درخواست‌تان به‌صورت رسمی پیگیری شود.
          </p>
          <div className="mt-3.5 text-[15px] font-medium text-brand">از مسیر: پنل ← پشتیبانی</div>
          <Link
            href="/login"
            className="mt-4.5 inline-flex items-center justify-center rounded-input border-[1.5px] border-brand/22 bg-white px-4 py-3 text-[15px] font-medium text-brand transition-colors hover:bg-brand/5"
          >
            ثبت تیکت
          </Link>
        </div>

        <div className="flex flex-col rounded-card border-2 border-brand bg-card p-7.5 shadow-modal">
          <span className="self-start rounded-pill bg-brand px-3 py-1.25 text-xs font-medium text-white">سریع‌ترین راه</span>
          <span aria-hidden="true" className="mt-4.5 flex h-14 w-14 items-center justify-center rounded-input bg-brand/10 text-brand">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M4 5h16v11H9l-4 3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="M8 9h8M8 12h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </span>
          <h2 className="mt-4.5 text-lg font-bold text-ink">تلگرام و واتساپ</h2>
          <p className="mt-2 flex-1 text-sm font-light leading-[2] text-text-1">
            برای پاسخ فوری، از طریق تلگرام یا واتساپ با پشتیبانی گفتگو کنید.
          </p>
          <div dir="ltr" className="mt-3.5 text-end text-[15px] font-medium text-brand">
            ۰۹۱۲۰۰۰۰۰۰۰
          </div>
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4.5 inline-flex items-center justify-center rounded-input bg-brand px-4 py-3.25 text-[15px] font-medium text-white shadow-[0_8px_17.5px_rgba(50,140,61,0.28)] transition-colors hover:bg-brand-hover"
          >
            شروع گفتگو
          </a>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3.5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex min-w-50 flex-1 items-center gap-3.25 rounded-card-sm border border-[#e3efe4] bg-[#f6faf6] px-5 py-4.5"
          >
            <span aria-hidden="true" className="flex h-11 w-11 flex-none items-center justify-center rounded-input bg-white text-brand shadow-float">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                {stat.icon}
              </svg>
            </span>
            <div className="leading-[1.5]">
              <div className="text-lg font-bold text-ink">{stat.value}</div>
              <div className="text-[13px] font-light text-text-2">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
