const stats = [
  {
    value: "۱۵ دقیقه",
    label: "صرفه‌جویی برای هر میز",
    color: "border-[#cfe6d2] bg-[#e9f4ea] text-brand",
    icon: (
      <path d="M12 7v5l3 2M12 3a9 9 0 100 18 9 9 0 000-18z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    value: "٪۱۸",
    label: "افزایش میانگین سفارش",
    color: "border-[#f1dfb8] bg-[#fbf3e3] text-[#c98a12]",
    icon: (
      <path d="M3 17l5-5 4 4 8-9M14 7h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    value: "+۴۵ هزار",
    label: "سفارش در ماه",
    color: "border-[#cfe1f5] bg-[#e8f1fb] text-[#2f7fd6]",
    icon: (
      <path d="M6 3h12v18l-6-3-6 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    ),
  },
  {
    value: "+۱۲۰",
    label: "کافه و رستوران فعال",
    color: "border-[#cfe6d2] bg-[#e9f4ea] text-brand",
    icon: (
      <path d="M4 10l1-6h14l1 6a3 3 0 01-6 1 3 3 0 01-6 0 3 3 0 01-6-1zM6 11v9h12v-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
];

export function StatsSection() {
  return (
    <section aria-label="آمار سرو" className="px-5 pt-17.5">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-6 rounded-card-sm border border-border-line bg-card p-8 shadow-float [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1.5 text-center">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl border ${stat.color}`}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                  {stat.icon}
                </svg>
              </span>
              <div className="text-[28px] font-black leading-[1.2] text-ink">{stat.value}</div>
              <div className="text-[13px] font-medium text-text-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
