const problems = [
  {
    title: "منوهای کاغذی قدیمی می‌شوند",
    description: "هر تغییر قیمت یعنی چاپ دوباره و هزینه‌ی مداوم.",
  },
  {
    title: "سفارش تلفنی خطا دارد",
    description: "اشتباه در ثبت سفارش، نارضایتی مشتری را به‌همراه دارد.",
  },
  {
    title: "مدیریت دستی زمان‌بر است",
    description: "پیگیری سفارش‌ها و گزارش‌گیری دستی وقت زیادی می‌گیرد.",
  },
];

const solutions = [
  {
    title: "منوی همیشه به‌روز",
    description: "قیمت و آیتم‌ها را در لحظه تغییر دهید؛ بدون چاپ دوباره.",
  },
  {
    title: "سفارش آنلاین بدون خطا",
    description: "مشتری خودش سفارش را ثبت می‌کند و خطای انسانی حذف می‌شود.",
  },
  {
    title: "پنل مدیریت یکپارچه",
    description: "سفارش، محصولات و گزارش فروش، همه در یک داشبورد.",
  },
];

export function AboutProblemSolution() {
  return (
    <section aria-label="مشکل رستوران‌ها و راه‌حل ماگ‌منو" className="mx-auto max-w-290 px-5 pb-5 pt-11">
      <div className="grid gap-5.5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        <div className="rounded-card-sm border border-[#f0e0e0] bg-card p-8 shadow-float">
          <span className="inline-flex items-center gap-2 rounded-pill bg-[#c73a3a]/10 px-3.5 py-1.5 text-[13px] font-medium text-[#c73a3a]">
            مشکل امروز رستوران‌ها
          </span>
          <div className="mt-5.5 flex flex-col gap-4.5">
            {problems.map((item) => (
              <div key={item.title} className="flex items-start gap-3.25">
                <span aria-hidden="true" className="flex h-8.5 w-8.5 flex-none items-center justify-center rounded-input bg-[#c73a3a]/10 text-[#c73a3a]">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                    <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
                  </svg>
                </span>
                <div className="leading-[1.7]">
                  <div className="text-base font-medium text-ink">{item.title}</div>
                  <div className="text-sm font-light text-text-1">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-card-sm border-2 border-brand bg-card p-8 shadow-modal">
          <span className="inline-flex items-center gap-2 rounded-pill bg-brand/10 px-3.5 py-1.5 text-[13px] font-medium text-brand">
            راه‌حل ماگ‌منو
          </span>
          <div className="mt-5.5 flex flex-col gap-4.5">
            {solutions.map((item) => (
              <div key={item.title} className="flex items-start gap-3.25">
                <span aria-hidden="true" className="flex h-8.5 w-8.5 flex-none items-center justify-center rounded-input bg-brand/12 text-brand">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div className="leading-[1.7]">
                  <div className="text-base font-medium text-ink">{item.title}</div>
                  <div className="text-sm font-light text-text-1">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
