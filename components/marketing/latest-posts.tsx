import Image from "next/image";
import Link from "next/link";

const posts = [
  {
    title: "چطور قیمت منو را درست تعیین کنیم؟",
    category: "بازاریابی",
    meta: "۶ دقیقه مطالعه · ۱۲ مهر ۱۴۰۵",
    image: "/marketing/home/blog-1.jpg",
  },
  {
    title: "منوی QR چیست و چرا رستوران‌ها به آن نیاز دارند؟",
    category: "مدیریت رستوران",
    meta: "۴ دقیقه مطالعه · ۱۲ مهر ۱۴۰۵",
    image: "/marketing/home/blog-2.jpg",
  },
  {
    title: "۷ روش افزایش فروش کافه با منوی دیجیتال",
    category: "آموزش",
    meta: "۵ دقیقه مطالعه · ۱۲ مهر ۱۴۰۵",
    image: "/marketing/home/blog-3.jpg",
  },
];

export function LatestPosts() {
  return (
    <section aria-labelledby="latest-posts-heading" className="px-5 py-17.5">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col items-end gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="order-2 text-center sm:order-1 sm:text-right">
            <span className="inline-flex items-center gap-2 rounded-pill bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M4 5a2 2 0 012-2h9l5 5v11a2 2 0 01-2 2H6a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              بلاگ
            </span>
            <h2
              id="latest-posts-heading"
              className="mt-4.5 text-[clamp(1.4rem,2.8vw,1.9rem)] font-bold leading-[1.4] tracking-[-0.4px] text-ink"
            >
              آخرین مقالات
            </h2>
          </div>
          <Link
            href="/blog"
            className="order-1 inline-flex items-center gap-2 rounded-btn border border-border-line bg-[#f4f5f4] px-5 py-2.75 text-sm font-medium text-ink transition-colors hover:bg-chip sm:order-2"
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            همه مقالات
          </Link>
        </div>

        <div className="mt-11 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          {posts.map((post) => (
            <Link
              key={post.title}
              href="/blog"
              className="rounded-card-sm border border-border-line bg-card p-2 shadow-float transition-shadow hover:shadow-modal"
            >
              <div className="relative h-50 w-full overflow-hidden rounded-[18px]">
                <Image src={post.image} alt={post.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
              <div className="px-3 pb-3 pt-3.5">
                <span className="inline-flex items-center rounded-pill bg-brand/10 px-3 py-1.25 text-xs font-medium text-brand">
                  {post.category}
                </span>
                <h3 className="mt-2.5 text-base font-extrabold leading-[1.65] text-ink">{post.title}</h3>
                <div className="mt-2.5 flex items-center gap-1.5 text-xs font-light text-text-3">
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {post.meta}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
