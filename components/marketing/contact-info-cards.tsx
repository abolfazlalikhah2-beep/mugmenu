const cards = [
  {
    label: "آدرس",
    value: "قم، بلوار جمهوری، گلستان ۸",
    hint: "ساختمان حافظ",
    valueDir: "rtl" as const,
    iconBg: "bg-[#fbf3e3] border-[#f1dfb8]",
    icon: (
      <>
        <path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.7" />
      </>
    ),
  },
  {
    label: "ایمیل",
    value: "info@mugmenu.ir",
    hint: "پاسخ در کمتر از یک روز کاری",
    valueDir: "ltr" as const,
    iconBg: "bg-[#e8f1fb] border-[#cfe1f5]",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.7" />
        <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    label: "تلفن",
    value: "۰۹۱۲۰۰۰۰۰۰۰",
    hint: "شنبه تا پنجشنبه · ۹ تا ۱۸",
    valueDir: "rtl" as const,
    iconBg: "bg-brand/10 border-brand/20",
    icon: <path d="M4.5 4h3.5l2 5-2.5 2a13 13 0 006 6l2-2.5 5 2V21a2 2 0 01-2 2C10.4 23 1 13.6 1 2.5A2 2 0 013 .5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
  },
];

export function ContactInfoCards() {
  return (
    <section aria-label="راه‌های ارتباط سریع" className="px-5 pb-10 sm:px-36 sm:pb-16">
      <div className="mx-auto grid max-w-[1200px] gap-5 sm:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="flex items-center gap-3.5 rounded-card-sm border border-[#e4e6e4] bg-card p-6 shadow-float"
          >
            <span className={`flex h-12 w-12 flex-none items-center justify-center rounded-input border ${card.iconBg} text-brand`}>
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
                {card.icon}
              </svg>
            </span>
            <div className="min-w-0 flex-1 text-right leading-[1.8]">
              <div className="text-xs font-semibold text-text-2">{card.label}</div>
              <div dir={card.valueDir} className="truncate text-[16px] font-black text-ink">
                {card.value}
              </div>
              <div className="text-xs font-light text-text-4">{card.hint}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
