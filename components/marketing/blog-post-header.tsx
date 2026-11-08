import Link from "next/link";

export interface BlogPostHeaderData {
  title: string;
  coverImage: string | null;
  publishedAt: Date | null;
  readMinutes: number;
  categoryName: string | null;
}

export function BlogPostHeader({ post }: { post: BlogPostHeaderData }) {
  return (
    <header className="px-5 pb-8 pt-10 sm:pt-14">
      <div className="mx-auto flex max-w-220 flex-col items-end gap-4.5 text-right">
        <nav aria-label="مسیر" className="flex items-center gap-2 text-[13px] font-light text-text-3">
          <Link href="/" className="transition-colors hover:text-brand">
            خانه
          </Link>
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Link href="/blog" className="transition-colors hover:text-brand">
            بلاگ
          </Link>
          {post.categoryName && (
            <>
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-bold text-brand">{post.categoryName}</span>
            </>
          )}
        </nav>

        {post.categoryName && (
          <span className="rounded-pill border border-[#cfe6d2] bg-[#e9f4ea] px-3.5 py-1.5 text-[13px] font-semibold text-brand">
            {post.categoryName}
          </span>
        )}

        <h1 className="w-full text-[clamp(1.6rem,3.8vw,2.6rem)] font-black leading-[1.45] tracking-[-0.4px] text-ink">
          {post.title}
        </h1>

        <div className="flex items-center gap-2.5">
          <div className="text-right leading-[1.8]">
            <div className="text-sm font-extrabold text-ink">تیم ماگ‌منو</div>
            <div className="text-xs font-light text-text-2">
              {post.publishedAt &&
                `${post.publishedAt.toLocaleDateString("fa-IR", { day: "2-digit", month: "long", year: "numeric" })} · `}
              {post.readMinutes.toLocaleString("fa-IR")} دقیقه مطالعه
            </div>
          </div>
          <span className="flex size-10 items-center justify-center rounded-full border border-[#cfe1f5] bg-[#e8f1fb] text-base font-extrabold text-[#2f7fd6]">
            م
          </span>
        </div>

        {post.coverImage ? (
          // Admin-typed arbitrary URL — not restricted to the S3 remotePattern next/image requires.
          <img
            src={post.coverImage}
            alt=""
            className="mt-2 h-[clamp(220px,42vw,500px)] w-full rounded-card object-cover shadow-modal"
          />
        ) : (
          <div
            aria-hidden="true"
            className="mt-2 flex h-[clamp(220px,42vw,500px)] w-full items-center justify-center rounded-card bg-gradient-to-br from-[#cfe6d2] to-[#8fc998] shadow-modal"
          >
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="text-white/85">
              <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
              <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
              <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M13 13h3v3M20 16v4M16 20h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </div>
    </header>
  );
}
