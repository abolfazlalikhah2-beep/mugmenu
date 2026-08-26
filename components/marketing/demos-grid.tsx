import Link from "next/link";

type PreviewItem = {
  name: string;
  price: string;
  gradient: string;
};

type Demo = {
  categoryLabel: string;
  categoryEmoji: string;
  businessName: string;
  statusLabel: string;
  tags: string[];
  previewItems: PreviewItem[];
  title: string;
  description: string;
  bgGradient: string;
};

const demos: Demo[] = [
  {
    categoryLabel: "کافه",
    categoryEmoji: "☕",
    businessName: "کافه رُز",
    statusLabel: "باز · تا ۲۳:۰۰",
    tags: ["همه", "گرم", "سرد"],
    previewItems: [
      { name: "کاپوچینو", price: "۸۵٬۰۰۰", gradient: "from-[#e8d3b8] to-[#cdae86]" },
      { name: "چیزکیک", price: "۱۲۰٬۰۰۰", gradient: "from-[#f0d0d8] to-[#e0a9b6]" },
    ],
    title: "دمو کافه",
    description: "مناسب کافه‌ها با منوی نوشیدنی و دسر و سفارش روی میز.",
    bgGradient: "from-[#e9f5ea] to-[#d3ecd6]",
  },
  {
    categoryLabel: "سنتی",
    categoryEmoji: "🍲",
    businessName: "سفره‌خانه سنتی",
    statusLabel: "باز · تا ۰۰:۰۰",
    tags: ["غذای اصلی", "خورشت"],
    previewItems: [
      { name: "چلوکباب", price: "۳۸۰٬۰۰۰", gradient: "from-[#e6c9a0] to-[#c99b5f]" },
      { name: "قورمه‌سبزی", price: "۲۹۰٬۰۰۰", gradient: "from-[#d9c7a3] to-[#b89a63]" },
    ],
    title: "دمو رستوران سنتی",
    description: "مناسب رستوران‌های سنتی با منوی غذای اصلی و سفارش میز و بیرون‌بر.",
    bgGradient: "from-[#f3ece0] to-[#e4d3ba]",
  },
  {
    categoryLabel: "فست‌فود",
    categoryEmoji: "🍔",
    businessName: "برگر لند",
    statusLabel: "باز · ارسال با پیک",
    tags: ["برگر", "پیتزا", "سوخاری"],
    previewItems: [
      { name: "چیزبرگر", price: "۲۱۰٬۰۰۰", gradient: "from-[#f4c98f] to-[#e09a4e]" },
      { name: "پیتزا مخصوص", price: "۳۲۰٬۰۰۰", gradient: "from-[#f0d59a] to-[#d9a556]" },
    ],
    title: "دمو فست‌فود",
    description: "مناسب فست‌فودها با سفارش آنلاین و ارسال با پیک و پرداخت اینترنتی.",
    bgGradient: "from-[#fdeede] to-[#f7d5b0]",
  },
  {
    categoryLabel: "قنادی",
    categoryEmoji: "🍰",
    businessName: "شیرینی‌سرای گل",
    statusLabel: "باز · سفارش تلفنی",
    tags: ["کیک", "شیرینی تر"],
    previewItems: [
      { name: "کیک شکلاتی", price: "۴۵۰٬۰۰۰", gradient: "from-[#f6d0e0] to-[#e5a3c2]" },
      { name: "دانمارکی", price: "۹۰٬۰۰۰", gradient: "from-[#f7dfa0] to-[#e6bd63]" },
    ],
    title: "دمو قنادی",
    description: "مناسب قنادی‌ها با نمایش کیک و شیرینی و سفارش پیش از تحویل.",
    bgGradient: "from-[#fbe9f0] to-[#f3cede]",
  },
];

export function DemosGrid() {
  return (
    <section aria-label="نمونه‌های منوی دیجیتال" className="px-5 py-6">
      <div className="mx-auto grid max-w-[1200px] gap-5.5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        {demos.map((demo) => (
          <DemoCard key={demo.title} demo={demo} />
        ))}
      </div>
    </section>
  );
}

function DemoCard({ demo }: { demo: Demo }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-card-sm border border-border-line bg-card shadow-float transition-shadow hover:shadow-modal">
      <div
        aria-hidden="true"
        className={`relative flex h-57.5 items-end justify-center overflow-hidden bg-gradient-to-br ${demo.bgGradient}`}
      >
        <span className="absolute end-3.5 top-3.5 rounded-pill bg-white/90 px-3 py-1.25 text-xs font-medium text-brand">
          {demo.categoryEmoji} {demo.categoryLabel}
        </span>

        <div className="w-37.5 rounded-t-[26px] bg-[#0e120f] px-2 pt-2 shadow-[0_-6px_24px_rgba(0,0,0,0.10)]">
          <div className="overflow-hidden rounded-t-[20px] bg-[#f7faf7]">
            <div className="bg-brand px-3 pb-2.5 pt-3.5 text-white">
              <div className="text-xs font-bold">{demo.businessName}</div>
              <div className="mt-0.5 text-[9px] opacity-85">{demo.statusLabel}</div>
            </div>
            <div className="flex gap-1.25 px-2.5 pb-1 pt-2.25">
              {demo.tags.map((tag, i) => (
                <span
                  key={tag}
                  className={
                    i === 0
                      ? "rounded-pill bg-brand px-2.25 py-0.75 text-[8px] text-white"
                      : "rounded-pill border border-[#e7ece7] bg-white px-2.25 py-0.75 text-[8px] text-[#4c554f]"
                  }
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-1.5 px-2.5 pb-1 pt-1">
              {demo.previewItems.map((item) => (
                <div key={item.name} className="flex items-center gap-1.75 rounded-[11px] border border-[#eef1ee] bg-white p-1.5">
                  <span className={`h-6.5 w-6.5 flex-none rounded-lg bg-gradient-to-br ${item.gradient}`} />
                  <div className="flex-1">
                    <div className="text-[8.5px] font-medium">{item.name}</div>
                    <div className="text-[8px] font-bold text-brand">{item.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5.5">
        <h2 className="text-lg font-bold text-ink">{demo.title}</h2>
        <p className="mt-2 flex-1 text-sm font-light leading-[1.9] text-text-1">{demo.description}</p>
        <Link
          href="/demo"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-btn bg-brand px-4 py-3.25 text-[15px] font-medium text-white shadow-[0_8px_17.5px_rgba(50,140,61,0.28)] transition-colors hover:bg-brand-hover"
        >
          <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path d="M10 9l5 3-5 3z" fill="currentColor" />
          </svg>
          مشاهده دمو زنده
        </Link>
      </div>
    </div>
  );
}
