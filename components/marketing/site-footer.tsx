import Link from "next/link";

const footerLinks = [
  { label: "درباره ما", href: "/about" },
  { label: "تعرفه‌ها", href: "/#pricing" },
  { label: "سوالات متداول", href: "/#faq" },
  { label: "تماس با ما", href: "/contact" },
  { label: "دمو", href: "/demo" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border-line bg-card px-5 py-11">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-70">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-input bg-brand shadow-[0_8px_17.5px_rgba(50,140,61,0.30)]"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 13.5C4 9 7.5 5.5 12 5.5S20 9 20 13.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M3 13.5h18" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M12 5.5V3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M6.5 17.5h11" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <span className="text-lg font-bold leading-none text-ink">ماگ‌منو</span>
          </div>
          <p className="mt-3.5 text-sm font-light leading-[1.9] text-text-1">
            منوی دیجیتال و پنل مدیریت هوشمند برای رستوران و کافه.
          </p>
        </div>

        <nav aria-label="لینک‌های فوتر" className="flex flex-wrap gap-x-7 gap-y-3">
          {footerLinks.map((link) => (
            <Link key={link.label} href={link.href} className="text-sm font-light text-text-1 transition-colors hover:text-brand">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="اینستاگرام ماگ‌منو"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-line text-text-1 transition-colors hover:border-brand hover:text-brand"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
            </svg>
          </a>
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="تلگرام ماگ‌منو"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-line text-text-1 transition-colors hover:border-brand hover:text-brand"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 4L3 11.5l6 2M21 4l-3 16-8-6.5M21 4L9 13.5v5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      <div className="mx-auto mt-9 max-w-[1200px] border-t border-border-line pt-6 text-center">
        <p className="font-mont text-xs font-light text-text-3">© ۱۴۰۴ سِرو — تمامی حقوق محفوظ است</p>
      </div>
    </footer>
  );
}
