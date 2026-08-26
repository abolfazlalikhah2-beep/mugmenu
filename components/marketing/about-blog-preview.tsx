import Link from "next/link";
import { BLOG_POSTS } from "@/components/marketing/blog-posts-data";

export function AboutBlogPreview() {
  return (
    <section aria-labelledby="about-blog-heading" className="mx-auto max-w-[1200px] px-5 py-11.5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-pill bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 3h9l4 4v13a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M8 9h6M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            بلاگ ماگ‌منو
          </span>
          <h2
            id="about-blog-heading"
            className="mt-4 text-[clamp(1.6rem,4vw,2.4rem)] font-bold leading-[1.4] tracking-[-0.4px] text-ink"
          >
            آخرین مقالات ما
          </h2>
        </div>
        <Link
          href="/blog"
          className="whitespace-nowrap rounded-input border-[1.5px] border-brand/22 bg-white px-6 py-3 text-[15px] font-medium text-brand transition-colors hover:bg-brand/5"
        >
          مشاهده همه
        </Link>
      </div>

      <div className="mt-9 grid gap-5.5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.slug}
            className="relative flex flex-col overflow-hidden rounded-card-sm border border-border-line bg-card shadow-float transition-shadow hover:shadow-modal"
          >
            <div aria-hidden="true" className={`flex h-42 items-center justify-center bg-gradient-to-br ${post.coverGradient}`}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" className="text-white/85">
                <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M13 13h3v3M20 16v4M16 20h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex flex-1 flex-col p-5.5">
              <time dateTime={post.publishedAtIso} className="text-xs font-light text-text-3">
                {post.publishedAt}
              </time>
              <h3 className="mt-2.25 text-[17px] font-medium leading-[1.7] text-ink">
                <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
                  {post.title}
                </Link>
              </h3>
              <p className="mt-2.25 flex-1 text-sm font-light leading-[1.9] text-text-1">{post.description}</p>
              <span aria-hidden="true" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand">
                ادامه مطلب
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
