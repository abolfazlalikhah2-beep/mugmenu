import Link from "next/link";

export interface BlogGridPost {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: Date | null;
  categoryName: string | null;
  readMinutes: number;
}

function formatMeta(post: BlogGridPost): string {
  const parts: string[] = [`${post.readMinutes.toLocaleString("fa-IR")} دقیقه مطالعه`];
  if (post.publishedAt) {
    parts.push(post.publishedAt.toLocaleDateString("fa-IR", { day: "2-digit", month: "long", year: "numeric" }));
  }
  return parts.join(" · ");
}

function CoverPhoto({ post, className }: { post: BlogGridPost; className: string }) {
  if (post.coverImage) {
    return (
      // Admin-typed arbitrary URL — not restricted to the S3 remotePattern next/image requires.
      <img src={post.coverImage} alt="" className={`${className} object-cover`} />
    );
  }
  return (
    <div aria-hidden="true" className={`${className} flex items-center justify-center bg-gradient-to-br from-[#cfe6d2] to-[#8fc998]`}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-white/85">
        <path d="M6 3h9l4 4v13a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M8 9h6M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function BlogFeaturedCard({ post }: { post: BlogGridPost }) {
  return (
    <article className="relative flex flex-col overflow-hidden rounded-card-sm border border-border-line bg-card p-2 shadow-float lg:flex-row-reverse">
      <CoverPhoto post={post} className="h-55 w-full shrink-0 rounded-[18px] lg:h-auto lg:w-[52%]" />
      <div className="flex flex-1 flex-col items-end gap-3.5 p-6 text-right">
        <span className="inline-flex items-center gap-1.5 rounded-pill border border-[#f1dfb8] bg-[#fbf3e3] px-3 py-1.25 text-xs font-semibold text-[#c98a12]">
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l2.4 5 5.6.8-4 3.9 1 5.5-5-2.6-5 2.6 1-5.5-4-3.9 5.6-.8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          مقاله ویژه
        </span>
        <h3 className="text-[22px] font-extrabold leading-[1.5] text-ink">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        <p className="text-sm font-light leading-[1.95] text-text-1">{post.excerpt}</p>
        <span className="text-xs font-light text-text-3">{formatMeta(post)}</span>
        <span
          aria-hidden="true"
          className="mt-1 inline-flex items-center gap-2 rounded-btn border border-brand/25 bg-white px-5 py-2.75 text-sm font-medium text-brand"
        >
          ادامه مطلب
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </article>
  );
}

export function BlogGrid({ posts }: { posts: BlogGridPost[] }) {
  if (posts.length === 0) {
    return (
      <div className="rounded-card-sm border border-border-line bg-card p-10 text-center text-sm font-light text-text-3">
        مقاله‌ای یافت نشد.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <article
          key={post.slug}
          className="relative flex flex-col overflow-hidden rounded-card-sm border border-border-line bg-card p-2 shadow-float transition-shadow hover:shadow-modal"
        >
          <CoverPhoto post={post} className="h-50 w-full rounded-[18px]" />
          <div className="flex flex-1 flex-col items-end gap-2.5 px-3 pb-3 pt-1.5 text-right">
            {post.categoryName && (
              <span className="rounded-pill border border-border-line bg-chip px-3 py-1.25 text-xs font-medium text-brand">
                {post.categoryName}
              </span>
            )}
            <h3 className="text-base font-extrabold leading-[1.65] text-ink">
              <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
                {post.title}
              </Link>
            </h3>
            <span className="inline-flex items-center gap-1.5 text-xs font-light text-text-3">
              {formatMeta(post)}
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
