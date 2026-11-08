import Image from "next/image";
import Link from "next/link";

const cases = [
  {
    business: "رستوران شبدر · قم",
    headline: "از ۸ به ۲ دقیقه",
    description: "زمان سفارش‌گیری هر میز با حذف منوی کاغذی و ثبت مستقیم سفارش در پنل، به یک‌چهارم رسید.",
    image: "/marketing/customers/case-kebab.png",
  },
  {
    business: "کافه کناری · تهران",
    headline: "٪۲۵ افزایش سفارش",
    description: "در ۳ ماه پس از راه‌اندازی منوی QR و سفارش سر میز، تعداد سفارش‌ها و میانگین سبد خرید رشد کرد.",
    image: "/marketing/customers/case-kenari-products.png",
  },
];

export function CustomersCaseStudies() {
  return (
    <section aria-labelledby="case-studies-heading" className="bg-[#f7f8f7] px-5 py-13">
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-[52ch] text-center">
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-[#cfe6d2] bg-[#e9f4ea] px-3 py-1.25 text-xs font-medium text-brand">
            داستان موفقیت
            <Image src="/marketing/customers/icon-trophy-green.svg" alt="" width={14} height={14} />
          </span>
          <h2
            id="case-studies-heading"
            className="mx-auto mt-4.5 max-w-[20ch] text-[clamp(1.4rem,2.8vw,1.9rem)] font-bold leading-[1.4] tracking-[-0.4px] text-ink"
          >
            نتایج واقعی، با اعداد
          </h2>
        </div>

        <div className="mt-11 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
          {cases.map((c) => (
            <div key={c.business} className="flex flex-col gap-2 rounded-card-sm border border-border-line bg-card p-2 shadow-float">
              <div className="relative h-65 w-full overflow-hidden rounded-[20px]">
                <Image src={c.image} alt={c.business} fill sizes="(min-width: 1024px) 560px, 90vw" className="object-cover" />
              </div>
              <div className="flex flex-col items-end gap-2.5 px-4 pb-4 pt-2 text-right">
                <span className="inline-flex items-center gap-1.5 rounded-pill border border-[#cfe1f5] bg-[#e8f1fb] px-3 py-1.25 text-xs font-medium text-[#2f7fd6]">
                  داستان موفقیت
                  <Image src="/marketing/customers/icon-trophy-blue.svg" alt="" width={14} height={14} />
                </span>
                <p className="text-lg font-black text-ink">{c.business}</p>
                <p className="text-[32px] font-black leading-[1.3] text-brand">{c.headline}</p>
                <p className="text-sm font-light leading-[1.9] text-text-1">{c.description}</p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-btn border border-border-line bg-chip px-5 py-2.75 text-sm font-medium text-ink"
                >
                  <Image src="/marketing/customers/icon-arrow-left.svg" alt="" width={16} height={16} />
                  خواندن داستان کامل
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
