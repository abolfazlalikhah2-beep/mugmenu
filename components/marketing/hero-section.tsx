import Link from "next/link";

const menuPreviewItems = [
  {
    name: "پیتزا مارگاریتا",
    description: "پنیر موزارلا، سس گوجه، ریحان تازه",
    price: "۱۸۵٬۰۰۰",
    gradient: "from-[#f0d0d8] to-[#e0a9b6]",
    iconColor: "text-[#a85d70]",
  },
  {
    name: "برگر کلاسیک",
    description: "گوشت گوساله، پنیر چدار، سس مخصوص",
    price: "۱۴۵٬۰۰۰",
    gradient: "from-[#e8d3b8] to-[#cdae86]",
    iconColor: "text-[#8a6a3d]",
  },
  {
    name: "سالاد سزار",
    description: "کاهو، مرغ گریل، پنیر پارمزان",
    price: "۹۸٬۰۰۰",
    gradient: "from-[#cfe6d2] to-[#a6d3ac]",
    iconColor: "text-[#3f8a49]",
  },
];

const heroHighlights = [
  "بدون نیاز به اپ مشتری",
  "راه‌اندازی در ۵ دقیقه",
  "سفارش‌گیری با QR",
  "پشتیبانی ۲۴ ساعته",
];

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-gradient-to-b from-[#f3faf4] to-white px-5 pb-16 pt-13"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-15 -top-22.5 h-85 w-85 rounded-full bg-brand opacity-14 blur-[44px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-22.5 top-40 h-80 w-80 rounded-full bg-brand opacity-12 blur-[44px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-30 left-[28%] h-65 w-65 rounded-full bg-[#4fb058] opacity-10 blur-[44px]" />

      <div className="relative mx-auto grid max-w-[1200px] items-center gap-11 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
        <div className="relative flex min-h-[560px] justify-center">
          <PhonePreview />
        </div>

        <div>
          <span className="inline-flex items-center gap-2 rounded-pill bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
              <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
              <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M13 13h3v3M20 16v4M16 20h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            منوی دیجیتال + مدیریت هوشمند رستوران
          </span>

          <h1
            id="hero-heading"
            className="mt-5 text-[clamp(2rem,5vw,3.4rem)] font-bold leading-[1.32] tracking-[-0.5px] text-ink"
          >
            منوی رستوران‌تان را با یک اسکن،
            <br />
            <span className="text-brand">دیجیتال و هوشمند</span> کنید
          </h1>

          <p className="mt-5 max-w-[42ch] text-[clamp(1rem,2.1vw,1.18rem)] font-light leading-[2] text-text-1">
            با ماگ‌منو در چند دقیقه یک منوی QR بسازید و سفارش‌های حضوری و آنلاین
            را بدون نیاز به نصب هیچ اپلیکیشنی توسط مشتری دریافت کنید.
          </p>

          <div className="mt-7.5 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-btn bg-brand px-7.5 py-3.5 text-base font-medium text-white shadow-[0_8px_17.5px_rgba(50,140,61,0.28)] transition-colors hover:bg-brand-hover"
            >
              شروع رایگان
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-btn border-[1.5px] border-brand/22 bg-white px-7 py-3.5 text-base font-medium text-brand transition-colors hover:bg-brand/5"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                <path d="M10 9l5 3-5 3z" fill="currentColor" />
              </svg>
              مشاهده دمو زنده
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6.5 gap-y-3.5">
            {heroHighlights.map((label) => (
              <div key={label} className="flex items-center gap-2 text-sm font-light text-text-1">
                <span aria-hidden="true" className="flex h-5.5 w-5.5 flex-none items-center justify-center rounded-full bg-brand/12 text-brand">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PhonePreview() {
  return (
    <div
      role="img"
      aria-label="پیش‌نمایش موبایل منوی دیجیتال ماگ‌منو، شامل دسته‌بندی محصولات، لیست آیتم‌های منو با قیمت، و اعلان ثبت سفارش جدید"
      className="relative w-[300px] animate-[svfloat_6s_ease-in-out_infinite]"
    >
      <div className="relative rounded-[44px] bg-[#0e120f] p-3 shadow-[0_26px_41px_rgba(0,0,0,0.14)]">
        <div className="absolute left-1/2 top-5 z-3 h-6.5 w-27.5 -translate-x-1/2 rounded-b-2xl bg-[#0e120f]" />
        <div className="relative flex h-144 flex-col overflow-hidden rounded-[34px] bg-[#f7faf7]">
          <div className="bg-brand px-4.5 pb-4.5 pt-8.5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div aria-hidden="true" className="flex h-9.5 w-9.5 items-center justify-center rounded-xl bg-white/18">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9h9a3 3 0 010 6h-1M6 9v9h8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 4.5v2M12 4.5v2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="leading-6">
                  <div className="text-[15px] font-bold">پیتزا رومینا</div>
                  <div className="text-[11px] opacity-85">میدان ولیعصر، تهران</div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/18 px-2.5 py-1 text-[11px]">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#8ff29a]" />
                باز · تا ۲۳:۰۰
              </span>
            </div>
          </div>

          <div className="flex flex-none gap-2 overflow-hidden px-4 pb-1.5 pt-3.5">
            <span className="flex-none rounded-full bg-brand px-3.5 py-1.75 text-xs font-medium text-white">همه</span>
            <span className="flex-none rounded-full border border-[#e7ece7] bg-white px-3.5 py-1.75 text-xs text-[#4c554f]">پیتزا</span>
            <span className="flex-none rounded-full border border-[#e7ece7] bg-white px-3.5 py-1.75 text-xs text-[#4c554f]">برگر</span>
            <span className="flex-none rounded-full border border-[#e7ece7] bg-white px-3.5 py-1.75 text-xs text-[#4c554f]">سالاد</span>
          </div>

          <div className="flex flex-1 flex-col gap-2.5 overflow-hidden px-4 pb-4 pt-2">
            {menuPreviewItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 rounded-[18px] border border-[#eef1ee] bg-white p-2.5 shadow-float"
              >
                <div
                  aria-hidden="true"
                  className={`flex h-15 w-15 flex-none items-center justify-center rounded-[14px] bg-gradient-to-br ${item.gradient} ${item.iconColor}`}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path d="M5 8h11a3 3 0 010 6h-1M5 8v9h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 3.5v2.5M11 3.5v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="flex-1 leading-[1.6]">
                  <div className="text-[13.5px] font-medium text-[#141a15]">{item.name}</div>
                  <div className="text-[11px] font-light text-[#8a938d]">{item.description}</div>
                </div>
                <div className="text-left">
                  <div className="whitespace-nowrap text-[13px] font-bold text-brand">{item.price}</div>
                  <button
                    aria-hidden="true"
                    tabIndex={-1}
                    className="mt-1.25 h-7.5 w-7.5 rounded-[10px] bg-brand text-lg leading-none text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -left-7.5 bottom-6.5 flex animate-[svtoast_.6s_ease_.4s_both] items-center gap-2.75 rounded-[18px] border border-[#eef1ee] bg-white p-3.5 shadow-float">
        <div aria-hidden="true" className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-brand">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="leading-[1.5]">
          <div className="text-[13px] font-medium text-[#141a15]">سفارش جدید ثبت شد</div>
          <div className="text-[11px] text-[#8a938d]">میز شماره ۷ · هم‌اکنون</div>
        </div>
      </div>
    </div>
  );
}
