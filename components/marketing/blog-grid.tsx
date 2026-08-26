import Link from "next/link";

export interface BlogGridPost {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: Date | null;
  categoryName: string | null;
}

export function BlogGrid({ posts }: { posts: BlogGridPost[] }) {
  if (posts.length === 0) {
    return (
      <div className="rounded-card-sm border border-border-line bg-card p-10 text-center text-sm font-light text-text-3">
        هنوز مقاله‌ای منتشر نشده است.
      </div>
    );
  }

  return (
    <div className="grid gap-5.5 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
      {posts.map((post) => (
        <article
          key={post.slug}
          className="relative flex flex-col overflow-hidden rounded-card-sm border border-border-line bg-card shadow-float transition-shadow hover:shadow-modal"
        >
          {post.coverImage ? (
            // Admin-typed arbitrary URL — not restricted to the S3 remotePattern next/image requires.
            <img src={post.coverImage} alt="" className="h-42.5 w-full object-cover" />
          ) : (
            <div aria-hidden="true" className="relative flex h-42.5 items-center justify-center bg-gradient-to-br from-[#cfe6d2] to-[#8fc998]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white/85">
                <path d="M6 3h9l4 4v13a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M8 9h6M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
          )}
          {post.categoryName && (
            <span className="absolute end-3.5 top-3.5 rounded-pill bg-white/92 px-3 py-1.25 text-xs font-medium text-brand">
              {post.categoryName}
            </span>
          )}

          <div className="flex flex-1 flex-col p-5.5">
            {post.publishedAt && (
              <time dateTime={post.publishedAt.toISOString()} className="text-xs font-light text-text-3">
                {post.publishedAt.toLocaleDateString("fa-IR", { day: "2-digit", month: "long", year: "numeric" })}
              </time>
            )}
            <h3 className="mt-2.5 text-[17px] font-medium leading-[1.7] text-ink">
              <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
                {post.title}
              </Link>
            </h3>
            <p className="mt-2.25 flex-1 text-sm font-light leading-[1.9] text-text-1">{post.excerpt}</p>
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
  );
}
