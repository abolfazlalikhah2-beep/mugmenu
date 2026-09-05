import Link from "next/link";

export interface PublicBlogPost {
  title: string;
  content: string;
  coverImage: string | null;
  publishedAt: Date | null;
  categoryNames: string[];
  tagNames: string[];
}

function estimateReadMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function BlogPostArticle({ post }: { post: PublicBlogPost }) {
  const category = post.categoryNames[0];
  const paragraphs = post.content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <article className="mx-auto max-w-205 px-5 pb-5 pt-10">
      <nav aria-label="مسیر" className="flex items-center gap-2 text-[13px] font-light text-text-3">
        <Link href="/blog" className="transition-colors hover:text-brand">
          بلاگ
        </Link>
        {category && (
          <>
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{category}</span>
          </>
        )}
      </nav>

      {category && (
        <span className="mt-4.5 inline-flex rounded-pill bg-brand/10 px-3.5 py-1.5 text-[13px] font-medium text-brand">
          {category}
        </span>
      )}

      <h1 className="mt-4 text-[clamp(1.5rem,3.4vw,2.1rem)] font-bold leading-[1.4] tracking-[-0.4px] text-ink">
        {post.title}
      </h1>

      <div className="mt-5 flex flex-wrap items-center gap-4 border-b border-border-line pb-6">
        {post.publishedAt && (
          <span className="inline-flex items-center gap-1.5 text-[13px] font-light text-text-1">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3.5" y="5" width="17" height="16" rx="3" stroke="currentColor" strokeWidth="1.6" />
              <path d="M3.5 9h17M8 3.5v3M16 3.5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <time dateTime={post.publishedAt.toISOString()}>
              {post.publishedAt.toLocaleDateString("fa-IR", { day: "2-digit", month: "long", year: "numeric" })}
            </time>
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 text-[13px] font-light text-text-1">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {estimateReadMinutes(post.content).toLocaleString("fa-IR")} دقیقه مطالعه
        </span>
      </div>

      {post.coverImage ? (
        // Admin-typed arbitrary URL — not restricted to the S3 remotePattern next/image requires.
        <img
          src={post.coverImage}
          alt=""
          className="mt-7 h-[clamp(220px,42vw,380px)] w-full rounded-card object-cover shadow-modal"
        />
      ) : (
        <div
          aria-hidden="true"
          className="mt-7 flex h-[clamp(220px,42vw,380px)] items-center justify-center rounded-card bg-gradient-to-br from-[#cfe6d2] to-[#8fc998] shadow-modal"
        >
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="text-white/85">
            <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M13 13h3v3M20 16v4M16 20h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>
      )}

      <div className="mt-2">
        {paragraphs.map((paragraph, i) => (
          <p key={i} className="mt-6 text-[17px] font-light leading-[2.2] text-text-1">
            {paragraph}
          </p>
        ))}
      </div>

      {post.tagNames.length > 0 && (
        <div className="mt-9 border-t border-border-line pt-6">
          <div className="text-sm font-medium text-ink">موضوعات مرتبط</div>
          <div className="mt-3.5 flex flex-wrap gap-2">
            {post.tagNames.map((tag) => (
              <span key={tag} className="rounded-pill border border-border-line bg-chip px-3.75 py-1.75 text-[13.5px] text-text-1">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
