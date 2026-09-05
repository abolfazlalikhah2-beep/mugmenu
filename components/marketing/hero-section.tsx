import Link from "next/link";
import { LeadCaptureForm } from "@/components/marketing/lead-capture-form";

const heroHighlights = [
  "بدون نیاز به اپ مشتری",
  "راه‌اندازی در ۵ دقیقه",
  "سفارش‌گیری با QR",
  "پشتیبانی ۲۴ ساعته",
];

export function HeroSection({ previewSlug = "demo" }: { previewSlug?: string }) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-gradient-to-b from-[#f3faf4] to-white px-5 pb-14 pt-11"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-15 -top-22.5 h-85 w-85 rounded-full bg-brand opacity-14 blur-[44px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-22.5 top-40 h-80 w-80 rounded-full bg-brand opacity-12 blur-[44px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-30 left-[28%] h-65 w-65 rounded-full bg-[#4fb058] opacity-10 blur-[44px]" />

      <div className="relative mx-auto grid max-w-[1200px] items-center gap-10 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        <div className="relative flex min-h-[540px] justify-center">
          <PhonePreview previewSlug={previewSlug} />
        </div>

        <div>
          <span className="inline-flex items-center gap-2 rounded-pill bg-brand/10 px-3.5 py-1.25 text-[13px] font-medium text-brand">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
              <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
              <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M13 13h3v3M20 16v4M16 20h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            منوی هوشمند برای کسب‌وکارهای خوشمزه
          </span>

          <h1
            id="hero-heading"
            className="mt-4 text-[clamp(1.6rem,3.4vw,2.4rem)] font-bold leading-[1.4] tracking-[-0.3px] text-ink"
          >
            منوی رستوران‌تان را
            <br />
            <span className="text-brand">دیجیتال و هوشمند</span> کنید
          </h1>

          <p className="mt-4 max-w-[42ch] text-[14px] font-light leading-[1.9] text-text-1">
            با سِرو در چند دقیقه یک منوی QR بسازید و سفارش‌های حضوری و آنلاین را
            بدون نیاز به نصب هیچ اپلیکیشنی توسط مشتری دریافت کنید.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link
              href="/register"
              className="rounded-btn bg-brand px-6.5 py-3 text-[14px] font-medium text-white shadow-[0_8px_17.5px_rgba(50,140,61,0.28)] transition-colors hover:bg-brand-hover"
            >
              شروع رایگان
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-btn border-[1.5px] border-brand/22 bg-white px-6 py-3 text-[14px] font-medium text-brand transition-colors hover:bg-brand/5"
            >
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                <path d="M10 9l5 3-5 3z" fill="currentColor" />
              </svg>
              مشاهده دمو زنده
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-5.5 gap-y-3">
            {heroHighlights.map((label) => (
              <div key={label} className="flex items-center gap-1.75 text-[13px] font-light text-text-1">
                <span aria-hidden="true" className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand/12 text-brand">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {label}
              </div>
            ))}
          </div>

          <div className="mt-7 max-w-[420px] rounded-card-sm border border-border-line bg-white/70 p-4.5 shadow-float">
            <p className="text-[13px] font-medium text-ink">
              شروع رایگان یک‌ماهه — شماره تلفن خود را وارد کنید
            </p>
            <div className="mt-2.5">
              <LeadCaptureForm source="hero" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhonePreview({ previewSlug }: { previewSlug: string }) {
  return (
    <div
      role="group"
      aria-label={`پیش‌نمایش زنده‌ی منوی دیجیتال، همان منویی که مشتریان شما با اسکن QR می‌بینند`}
      className="relative w-[300px] animate-[svfloat_6s_ease-in-out_infinite]"
    >
      <div className="relative rounded-[44px] bg-[#0e120f] p-3 shadow-[0_26px_41px_rgba(0,0,0,0.14)]">
        <div className="absolute left-1/2 top-5 z-3 h-6.5 w-27.5 -translate-x-1/2 rounded-b-2xl bg-[#0e120f]" />
        <div className="relative h-144 overflow-hidden rounded-[34px] bg-[#f7faf7]">
          <iframe
            src={`/${previewSlug}`}
            title="پیش‌نمایش زنده منوی دیجیتال"
            loading="lazy"
            className="h-full w-full border-0"
          />
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
