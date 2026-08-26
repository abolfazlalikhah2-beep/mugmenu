import Link from "next/link";
import type { BlogPost } from "@/components/marketing/blog-posts-data";

export function BlogPostArticle({ post }: { post: BlogPost }) {
  return (
    <article className="mx-auto max-w-205 px-5 pb-5 pt-10">
      <nav aria-label="مسیر" className="flex items-center gap-2 text-[13px] font-light text-text-3">
        <Link href="/blog" className="transition-colors hover:text-brand">
          بلاگ
        </Link>
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>{post.category}</span>
      </nav>

      <span className="mt-4.5 inline-flex rounded-pill bg-brand/10 px-3.5 py-1.5 text-[13px] font-medium text-brand">
        {post.category}
      </span>

      <h1 className="mt-4 text-[clamp(1.8rem,4.6vw,2.8rem)] font-bold leading-[1.4] tracking-[-0.4px] text-ink">
        {post.title}
      </h1>

      <div className="mt-5 flex flex-wrap items-center gap-4 border-b border-border-line pb-6">
        <div className="flex items-center gap-2.5">
          <span aria-hidden="true" className={`h-10 w-10 flex-none rounded-full bg-gradient-to-br ${post.coverGradient}`} />
          <div className="leading-[1.5]">
            <div className="text-sm font-medium text-ink">{post.authorName}</div>
            <div className="text-xs font-light text-text-3">{post.authorRole}</div>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 text-[13px] font-light text-text-1">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="3.5" y="5" width="17" height="16" rx="3" stroke="currentColor" strokeWidth="1.6" />
            <path d="M3.5 9h17M8 3.5v3M16 3.5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <time dateTime={post.publishedAtIso}>{post.publishedAt}</time>
        </span>

        <span className="inline-flex items-center gap-1.5 text-[13px] font-light text-text-1">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {post.readMinutes.toLocaleString("fa-IR")} دقیقه مطالعه
        </span>
      </div>

      <div
        aria-hidden="true"
        className={`mt-7 flex h-[clamp(220px,42vw,380px)] items-center justify-center rounded-card bg-gradient-to-br ${post.coverGradient} shadow-modal`}
      >
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="text-white/85">
          <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M13 13h3v3M20 16v4M16 20h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>

      <div className="mt-2">
        {post.body.map((block, i) => {
          if (block.type === "heading") {
            return (
              <h2 key={i} className="mt-8 text-xl font-bold leading-[1.6] text-ink">
                {block.text}
              </h2>
            );
          }
          if (block.type === "callout") {
            return (
              <div
                key={i}
                className="mt-6 flex gap-3.5 rounded-card-sm border border-border-line border-r-4 border-r-brand bg-chip p-5"
              >
                <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-none text-brand">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M12 8v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  <circle cx="12" cy="16" r="0.9" fill="currentColor" />
                </svg>
                <p className="text-[15px] font-light leading-[2] text-text-1">{block.text}</p>
              </div>
            );
          }
          return (
            <p key={i} className="mt-6 text-[17px] font-light leading-[2.2] text-text-1">
              {block.text}
            </p>
          );
        })}
      </div>

      <div className="mt-9 border-t border-border-line pt-6">
        <div className="text-sm font-medium text-ink">موضوعات مرتبط</div>
        <div className="mt-3.5 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-pill border border-border-line bg-chip px-3.75 py-1.75 text-[13.5px] text-text-1">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
