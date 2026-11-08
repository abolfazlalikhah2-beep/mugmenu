import Image from "next/image";

const modes = [
  {
    title: "ارسال با پیک",
    description: "سفارش با آدرس مشتری مستقیم وارد پنل می‌شود.",
    badge: "ارسال با پیک",
    badgeColor: "border-[#f1dfb8] text-[#c98a12]",
    image: "/marketing/home/order-delivery.jpg",
    icon: (
      <path d="M3 13h11V7H3zM14 10h4l3 3v3h-7zM6.5 19a2 2 0 100-4 2 2 0 000 4zM17.5 19a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    ),
  },
  {
    title: "بیرون‌بر",
    description: "سفارش آنلاین و دریافت حضوری، بدون معطلی در صف.",
    badge: "بیرون‌بر",
    badgeColor: "border-[#cfe1f5] text-[#2f7fd6]",
    image: "/marketing/home/order-takeaway.jpg",
    icon: (
      <path d="M4 6h2l2 11h9l2-8H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "سفارش سر میز",
    description: "مشتری QR میز را اسکن می‌کند و شماره میز خودکار ثبت می‌شود.",
    badge: "سفارش سر میز",
    badgeColor: "border-brand/25 text-brand",
    image: "/marketing/home/order-table.jpg",
    icon: (
      <path d="M7 3v8M5 3v5a2 2 0 002 2 2 2 0 002-2V3M17 3v18M17 3a4 4 0 00-4 4v2h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
];

export function OrderModes() {
  return (
    <section aria-labelledby="order-modes-heading" className="bg-[#f7f8f7] px-5 py-17.5">
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-[52ch] text-center">
          <span className="inline-flex items-center gap-2 rounded-pill bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h2l2 11h9l2-8H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            ۳ حالت سفارش
          </span>
          <h2
            id="order-modes-heading"
            className="mx-auto mt-4.5 max-w-[20ch] text-[clamp(1.4rem,2.8vw,1.9rem)] font-bold leading-[1.4] tracking-[-0.4px] text-ink"
          >
            هر جور مشتری‌ات بخواد، سفارش بگیر
          </h2>
          <p className="mx-auto mt-3 max-w-[40ch] text-sm font-light text-text-1">
            سر میز، بیرون‌بر یا ارسال؛ همه در یک منو و یک پنل.
          </p>
        </div>

        <div className="mt-11 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          {modes.map((mode) => (
            <div
              key={mode.title}
              className="rounded-card-sm border border-border-line bg-card p-2 shadow-float"
            >
              <div className="relative h-57.5 w-full overflow-hidden rounded-[18px]">
                <Image src={mode.image} alt={mode.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                <span
                  className={`absolute right-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-pill border bg-white px-3 py-1.25 text-xs font-medium ${mode.badgeColor}`}
                >
                  {mode.badge}
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    {mode.icon}
                  </svg>
                </span>
              </div>
              <div className="px-3 pb-3 pt-4">
                <div className="text-lg font-extrabold text-ink">{mode.title}</div>
                <p className="mt-1.5 text-[13px] font-light leading-[1.8] text-text-1">{mode.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
