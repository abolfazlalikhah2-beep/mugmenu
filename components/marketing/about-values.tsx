const values = [
  {
    title: "شفافیت قیمت",
    description: "بدون هزینه پنهان؛ همه چیز روی صفحه تعرفه‌ها.",
    color: "border-[#cfe6d2] bg-[#e9f4ea] text-brand",
    icon: (
      <path d="M12 3l7 3v5c0 4.5-3 8.2-7 9.5C8 19.2 5 15.5 5 11V6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    ),
  },
  {
    title: "پشتیبانی واقعی",
    description: "آدم واقعی، از ۹ تا ۱۸ پاسخگوی شماست.",
    color: "border-[#f1dfb8] bg-[#fbf3e3] text-[#c98a12]",
    icon: (
      <path d="M4 13a8 8 0 0116 0v5a2 2 0 01-2 2h-1v-7h3M4 18v-5a2 2 0 012-2h1v7H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    ),
  },
  {
    title: "سرعت",
    description: "منوی سریع برای مشتری، پنل سریع برای شما.",
    color: "border-[#cfe1f5] bg-[#e8f1fb] text-[#2f7fd6]",
    icon: <path d="M13 2L4 14h6l-1 8 9-12h-6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />,
  },
  {
    title: "سادگی",
    description: "هر چیزی که می‌سازیم باید بدون آموزش قابل استفاده باشد.",
    color: "border-[#cfe6d2] bg-[#e9f4ea] text-brand",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </>
    ),
  },
];

export function AboutValues() {
  return (
    <section aria-labelledby="values-heading" className="bg-[#f7f8f7] px-5 py-13 lg:py-19">
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-[52ch] text-center">
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-[#cfe6d2] bg-[#e9f4ea] px-3 py-1.25 text-[13px] font-medium text-brand">
            ارزش‌ها
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s-7.5-4.7-10.1-8.9C.3 8.6 2 4.6 6 4a5.3 5.3 0 016 2.4A5.3 5.3 0 0118 4c4 .6 5.7 4.6 4.1 8.1C19.5 16.3 12 21 12 21z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h2
            id="values-heading"
            className="mx-auto mt-4.5 max-w-[20ch] text-[clamp(1.4rem,2.8vw,1.9rem)] font-bold leading-[1.4] tracking-[-0.4px] text-ink"
          >
            چیزهایی که به آن‌ها باور داریم
          </h2>
        </div>

        <div className="mt-11 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="flex flex-col items-end gap-3.5 rounded-card-sm border border-border-line bg-card p-6 text-right shadow-float"
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-input border ${value.color}`}>
                <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
                  {value.icon}
                </svg>
              </span>
              <p className="text-[17px] font-black text-ink">{value.title}</p>
              <p className="text-[13px] font-light leading-[1.9] text-text-2">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
