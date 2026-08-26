const latestPosts = [
  { title: "چرا رستوران شما به منوی QR نیاز دارد؟", date: "۱۴ مرداد ۱۴۰۴", gradient: "from-[#cfe6d2] to-[#8fc998]" },
  { title: "کدام رستوران‌ها بیشترین سود را از منوی دیجیتال می‌برند؟", date: "۷ مرداد ۱۴۰۴", gradient: "from-[#e8d3b8] to-[#cdae86]" },
  { title: "راهنمای راه‌اندازی منو در ۵ دقیقه", date: "۱ مرداد ۱۴۰۴", gradient: "from-[#bfe0f0] to-[#8ec3e0]" },
];

const categories = [
  { label: "منوی دیجیتال", count: "۸" },
  { label: "مدیریت سفارش", count: "۵" },
  { label: "رشد کسب‌وکار", count: "۶" },
  { label: "آموزش پنل", count: "۴" },
];

const tags = ["منوی QR", "سفارش آنلاین", "کافه", "فست‌فود", "گزارش فروش", "پیک"];

export function BlogSidebar() {
  return (
    <aside aria-label="نوار کناری بلاگ" className="flex flex-col gap-4.5">
      <div className="rounded-card-sm border border-border-line bg-card p-4.5 shadow-float">
        <label htmlFor="blog-search" className="sr-only">
          جستجو در مقالات
        </label>
        <div className="flex items-center gap-2.5 rounded-input border border-border-input bg-chip px-3.5 py-2.75">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-none text-text-3">
            <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
            <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <input
            id="blog-search"
            type="search"
            placeholder="جستجو در مقالات…"
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-text-3"
          />
        </div>
      </div>

      <div className="rounded-card-sm border border-border-line bg-card p-5.5 shadow-float">
        <h2 className="text-base font-bold text-ink">جدیدترین پست‌ها</h2>
        <ul className="mt-4 flex flex-col gap-3.5">
          {latestPosts.map((post) => (
            <li key={post.title} className="flex items-center gap-3">
              <span aria-hidden="true" className={`h-14 w-14 flex-none rounded-input bg-gradient-to-br ${post.gradient}`} />
              <div className="leading-[1.6]">
                <div className="text-[13.5px] font-medium text-ink">{post.title}</div>
                <div className="text-[11.5px] font-light text-text-3">{post.date}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-card-sm border border-border-line bg-card p-5.5 shadow-float">
        <h2 className="text-base font-bold text-ink">دسته‌بندی‌ها</h2>
        <ul className="mt-3 flex flex-col">
          {categories.map((category, index) => (
            <li
              key={category.label}
              className={`flex items-center justify-between py-2.5 text-sm font-light text-text-1 ${
                index < categories.length - 1 ? "border-b border-border-line" : ""
              }`}
            >
              {category.label}
              <span className="rounded-pill bg-brand/10 px-2.25 py-0.5 text-xs text-brand">{category.count}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-card-sm border border-border-line bg-card p-5.5 shadow-float">
        <h2 className="text-base font-bold text-ink">برچسب‌های پرکاربرد</h2>
        <div className="mt-3.5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-pill border border-border-input bg-chip px-3.25 py-1.5 text-xs text-text-1">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
