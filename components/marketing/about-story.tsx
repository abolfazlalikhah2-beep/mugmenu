import Image from "next/image";

export function AboutStory() {
  return (
    <section aria-labelledby="story-heading" className="px-5 py-13 lg:py-19">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="order-1 flex flex-col items-center gap-4.5 text-center lg:order-1 lg:max-w-104 lg:items-end lg:text-right">
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-[#cfe6d2] bg-[#e9f4ea] px-3 py-1.25 text-[13px] font-medium text-brand">
            داستان ما
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M4 5.5a2 2 0 012-2h5.5v16H6a2 2 0 00-2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M20 5.5a2 2 0 00-2-2h-5.5v16H18a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </span>

          <h2 id="story-heading" className="text-[clamp(1.5rem,3vw,2rem)] font-black leading-[1.5] text-ink">
            از یک منوی کاغذی
            <br />
            تا یک محصول
          </h2>

          <p className="max-w-[48ch] text-[14px] font-light leading-[2] text-text-1">
            سرو از یک تجربه ساده شروع شد: منوهای کاغذی که مدام کهنه می‌شدند، قیمت‌هایی که باید با خودکار اصلاح می‌شد و
            مشتری‌هایی که برای سفارش منتظر می‌ماندند. ما تصمیم گرفتیم ابزاری بسازیم که هر کافه و رستورانی، بدون دانش
            فنی، در کمتر از یک ساعت منوی هوشمند خودش را داشته باشد.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-end">
            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-1">
              +۱۲۰ مشتری فعال
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#328c3d" strokeWidth="1.5" />
                <path d="M8.5 12.5l2.4 2.4L16 9.8" stroke="#328c3d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-1">
              راه‌اندازی در ۱۴۰۳
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#328c3d" strokeWidth="1.5" />
                <path d="M8.5 12.5l2.4 2.4L16 9.8" stroke="#328c3d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>

        <div className="relative order-2 h-75 w-full max-w-87.5 shrink-0 lg:order-2 lg:h-110 lg:w-140 lg:max-w-none">
          <div className="absolute end-0 top-0 h-62 w-69 overflow-hidden rounded-[28px] sm:h-70 lg:h-88 lg:w-103.5">
            <Image
              src="/marketing/about/story-cafe.png"
              alt="نمای داخلی کافه کناری"
              fill
              sizes="(min-width: 1024px) 414px, 70vw"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 start-0 h-37.5 w-40 overflow-hidden rounded-3xl border-4 border-white shadow-[0_24px_60px_0_rgba(13,20,15,0.12)] sm:h-40 lg:h-55 lg:w-64.5">
            <Image
              src="/marketing/about/story-drink.png"
              alt="نوشیدنی سرو شده در کافه کناری"
              fill
              sizes="(min-width: 1024px) 258px, 42vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
