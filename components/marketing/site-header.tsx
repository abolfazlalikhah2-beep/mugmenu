import Link from "next/link";

const navLinks = [
  { label: "خانه", href: "/" },
  { label: "تعرفه‌ها", href: "/pricing" },
  { label: "مشتریان", href: "/customers" },
  { label: "درباره ما", href: "/about" },
  { label: "تماس با ما", href: "/contact" },
  { label: "بلاگ", href: "/blog" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-3.5 z-100 px-4">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 rounded-pill border border-brand/10 bg-white/92 px-3.5 py-2.25 shadow-float backdrop-blur">
        <Link href="/" className="flex items-center gap-2.25 pe-2">
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
        </Link>

        <nav aria-label="پیوندهای اصلی" className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-pill px-3 py-1.75 text-[13px] text-text-1 transition-colors hover:bg-brand/8 hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/register"
          className="whitespace-nowrap rounded-input bg-brand px-4.5 py-2.25 text-[13px] font-medium text-white shadow-[0_8px_17.5px_rgba(50,140,61,0.28)] transition-colors hover:bg-brand-hover"
        >
          ورود / ثبت‌نام
        </Link>
      </div>
    </header>
  );
}
