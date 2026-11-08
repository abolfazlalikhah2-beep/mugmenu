import Image from "next/image";

const products = [
  {
    title: "اسپرسو سینگل",
    description: "قهوه ۱۰۰٪ عربیکا با شکلات تلخ",
    price: "۱۴۵,۰۰۰",
    image: "/marketing/home/menu-product-2.jpg",
  },
  {
    title: "شیک توت‌فرنگی",
    description: "بستنی وانیل، توت‌فرنگی تازه",
    price: "۲۲۰,۰۰۰",
    image: "/marketing/home/menu-product-3.jpg",
  },
  {
    title: "موهیتو لیمو",
    description: "لیمو، نعنا، سودا",
    price: "۱۸۵,۰۰۰",
    image: "/marketing/home/menu-product-4.jpg",
  },
];

export function MenuShowcase({ previewSlug = "demo" }: { previewSlug?: string }) {
  return (
    <section aria-labelledby="menu-showcase-heading" className="bg-[#f7f8f7] px-5 py-17.5">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10 lg:flex-row-reverse">
        <div className="flex-1">
          <span className="inline-flex items-center gap-2 rounded-pill bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="7" y="2" width="10" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 18h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            منوی مشتری
          </span>
          <h2
            id="menu-showcase-heading"
            className="mt-4.5 max-w-[16ch] text-[clamp(1.4rem,2.8vw,1.9rem)] font-black leading-[1.5] tracking-[-0.4px] text-ink"
          >
            منویی که مشتری‌هات عاشقش می‌شن
          </h2>
          <p className="mt-3 max-w-[44ch] text-sm font-light leading-[1.95] text-text-1">
            عکس‌های اشتهاآور، دسته‌بندی ساده، جستجو و افزودن به سبد؛ دقیقاً همان چیزی که مشتری در منوی سرو می‌بیند.
          </p>

          <div className="mt-5 flex flex-col gap-2.5">
            {products.map((product) => (
              <div
                key={product.title}
                className="flex items-center gap-3 rounded-[18px] border border-border-line bg-card p-3 shadow-float"
              >
                <span className="flex h-7.5 w-7.5 flex-none items-center justify-center rounded-[15px] border border-brand/25 bg-brand/10 text-brand">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-extrabold text-ink">{product.title}</div>
                  <div className="truncate text-[11px] font-light text-text-1">{product.description}</div>
                  <div className="mt-1 flex items-center gap-1 text-xs">
                    <span className="text-text-3">تومان</span>
                    <span className="font-extrabold text-brand">{product.price}</span>
                  </div>
                </div>
                <div className="relative h-18 w-18 flex-none overflow-hidden rounded-[14px]">
                  <Image src={product.image} alt={product.title} fill sizes="72px" className="object-cover" />
                </div>
              </div>
            ))}
          </div>

          <a
            href={`/${previewSlug}`}
            className="mt-5 inline-flex items-center gap-2 rounded-btn border border-brand/25 bg-white px-5 py-2.75 text-sm font-medium text-brand transition-colors hover:bg-brand/5"
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            مشاهده منوی نمونه
          </a>
        </div>

        <div className="relative h-100 w-67.5 flex-none">
          <div className="absolute inset-x-0 top-7.5 h-85 overflow-hidden rounded-[36px]">
            <Image src="/marketing/home/menu-brand-panel.jpg" alt="" fill sizes="270px" className="object-cover" />
          </div>
          <div className="absolute right-15.5 top-0 h-85 w-67.5 overflow-hidden rounded-[43px] bg-[#0e120f] p-2 shadow-[0_24px_30px_rgba(13,20,15,0.12)]">
            <div className="relative h-full w-full overflow-hidden rounded-[35px]">
              <Image src="/marketing/home/menu-phone.jpg" alt="پیش‌نمایش منوی مشتری" fill sizes="254px" className="object-cover" />
            </div>
          </div>
          <div className="absolute -right-8 bottom-6 flex items-center gap-2.75 rounded-[18px] border border-border-line bg-white p-3 shadow-modal">
            <span className="flex h-7.5 w-7.5 flex-none items-center justify-center rounded-[15px] border border-brand/25 bg-brand/10 text-brand">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <div className="leading-[1.5]">
              <div className="text-xs font-extrabold text-ink">آیس لاته</div>
              <div className="text-[10px] text-text-3">اسپرسو، شیر سرد، یخ · ۱۹۵,۰۰۰</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
