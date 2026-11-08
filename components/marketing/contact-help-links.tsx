import Link from "next/link";

const links = [
  {
    href: "/faq",
    title: "سوالات متداول",
    desc: "جواب سریع سؤال‌های رایج",
    icon: (
      <path d="M4 5h16v11H9l-4 3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    ),
  },
  {
    href: "/help",
    title: "مرکز راهنما",
    desc: "آموزش قدم‌به‌قدم امکانات ماگ‌منو",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9.5 9.5a2.5 2.5 0 114 2c-.9.7-1.5 1.2-1.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="12" cy="17" r="0.9" fill="currentColor" />
      </>
    ),
  },
];

export function ContactHelpLinks() {
  return (
    <section aria-label="لینک‌های راهنما" className="px-5 py-10 sm:px-36 sm:py-16">
      <div className="mx-auto grid max-w-[1200px] gap-5 sm:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className="flex items-center gap-3.5 rounded-card-sm border border-[#e4e6e4] bg-card p-6 shadow-float transition-shadow hover:shadow-modal"
          >
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-pill border border-[#e4e6e4] bg-[#f4f5f4] text-ink">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="min-w-0 flex-1 text-right leading-[1.8]">
              <div className="text-base font-black text-ink">{link.title}</div>
              <div className="text-[13px] font-light text-text-2">{link.desc}</div>
            </div>
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-input border border-[#cfe6d2] bg-[#e9f4ea] text-brand">
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
                {link.icon}
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
