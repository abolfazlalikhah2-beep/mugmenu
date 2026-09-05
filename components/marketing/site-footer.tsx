import Link from "next/link";

const footerLinks = [
  { label: "خانه", href: "/" },
  { label: "تعرفه‌ها", href: "/pricing" },
  { label: "مشتریان", href: "/customers" },
  { label: "درباره ما", href: "/about" },
  { label: "بلاگ", href: "/blog" },
  { label: "سوالات متداول", href: "/faq" },
  { label: "تماس با ما", href: "/contact" },
  { label: "دمو زنده", href: "/demo" },
];

const FOOTER_PHONE = "09302280994";
const FOOTER_HOURS = "۹ صبح تا ۱۸";

export function SiteFooter() {
  return (
    <footer className="border-t border-border-line bg-card px-5 py-9">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-7 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-70">
          <div className="flex items-center gap-2.25">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-input bg-brand shadow-[0_8px_17.5px_rgba(50,140,61,0.30)]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 13.5C4 9 7.5 5.5 12 5.5S20 9 20 13.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M3 13.5h18" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M12 5.5V3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M6.5 17.5h11" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <span className="text-base font-bold leading-none text-ink">سِرو</span>
          </div>
          <p className="mt-3 text-[13px] font-light leading-[1.9] text-text-1">
            منوی هوشمند برای کسب‌وکارهای خوشمزه.
          </p>

          <div className="mt-4 flex flex-col gap-1.5 text-[13px] font-light text-text-1">
            <a href={`tel:${FOOTER_PHONE}`} dir="ltr" className="w-fit text-end transition-colors hover:text-brand">
              {FOOTER_PHONE}
            </a>
            <span className="text-text-2">پاسخگویی: {FOOTER_HOURS}</span>
          </div>
        </div>

        <nav aria-label="لینک‌های فوتر" className="flex flex-wrap gap-x-6 gap-y-2.5">
          {footerLinks.map((link) => (
            <Link key={link.label} href={link.href} className="text-[13px] font-light text-text-1 transition-colors hover:text-brand">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://instagram.com/servo.menu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="اینستاگرام سِرو"
            className="flex h-9.5 w-9.5 items-center justify-center rounded-full border border-border-line text-text-1 transition-colors hover:border-brand hover:text-brand"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
            </svg>
          </a>
          <a
            href="https://t.me/servomenu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="تلگرام سِرو"
            className="flex h-9.5 w-9.5 items-center justify-center rounded-full border border-border-line text-text-1 transition-colors hover:border-brand hover:text-brand"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M21 4L3 11.5l6 2M21 4l-3 16-8-6.5M21 4L9 13.5v5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href={`tel:${FOOTER_PHONE}`}
            aria-label="تماس تلفنی با سِرو"
            className="flex h-9.5 w-9.5 items-center justify-center rounded-full border border-border-line text-text-1 transition-colors hover:border-brand hover:text-brand"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 4.5h3.2l1.3 4.2-2 1.7a11 11 0 006.1 6.1l1.7-2 4.2 1.3V19c0 .8-.6 1.5-1.4 1.5C11.2 20.3 3.7 12.8 3.5 6.9c0-.8.6-1.5 1.5-1.5z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>

      <div className="mx-auto mt-7 flex max-w-[1200px] flex-wrap items-center gap-3">
        <div
          aria-label="نماد اعتماد الکترونیکی (اینماد) — به‌زودی"
          className="flex h-16 w-16 flex-none items-center justify-center rounded-input border border-dashed border-border-input bg-white text-center text-[10px] font-light leading-tight text-text-3"
        >
          اینماد
        </div>
        <div
          aria-label="درگاه پرداخت بانکی — به‌زودی"
          className="flex h-16 w-28 flex-none items-center justify-center rounded-input border border-dashed border-border-input bg-white text-center text-[10px] font-light leading-tight text-text-3"
        >
          درگاه پرداخت
        </div>
      </div>

      <div className="mx-auto mt-7 max-w-[1200px] border-t border-border-line pt-5 text-center">
        <p className="font-mont text-[11px] font-light text-text-3">© ۱۴۰۴ سِرو — تمامی حقوق محفوظ است</p>
      </div>
    </footer>
  );
}
