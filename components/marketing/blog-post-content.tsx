export interface BlogPostContentData {
  content: string;
  tagNames: string[];
}

function splitParagraphs(content: string): string[] {
  return content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function BlogPostContent({ post }: { post: BlogPostContentData }) {
  const paragraphs = splitParagraphs(post.content);

  return (
    <section className="px-5 pb-14 pt-4">
      <div className="mx-auto flex max-w-220 flex-col-reverse gap-10 lg:flex-row-reverse lg:items-start">
        <aside className="hidden w-75 shrink-0 rounded-card-sm border border-border-line bg-card p-6 shadow-float lg:sticky lg:top-24 lg:flex lg:flex-col lg:items-end lg:gap-3.5">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-black text-ink">فهرست مطالب</h2>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          {paragraphs.map((_, i) => (
            <a
              key={i}
              href={`#section-${i}`}
              className={`flex items-center gap-2 text-[13px] ${i === 0 ? "font-extrabold text-brand" : "font-light text-text-1"}`}
            >
              بخش {(i + 1).toLocaleString("fa-IR")}
              <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
            </a>
          ))}
        </aside>

        <article className="flex-1 text-right">
          {paragraphs.map((paragraph, i) => (
            <p key={i} id={`section-${i}`} className="scroll-mt-28 text-[16px] font-light leading-[2.1] text-text-1 [&:not(:first-child)]:mt-6">
              {paragraph}
            </p>
          ))}

          <div className="mt-9 flex flex-wrap items-center justify-end gap-2.5">
            <span className="text-sm font-bold text-ink">اشتراک‌گذاری:</span>
            <a
              href="#"
              aria-label="اشتراک‌گذاری در تلگرام"
              className="flex size-9 items-center justify-center rounded-full border border-border-line bg-chip text-text-1 transition-colors hover:text-brand"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M21 4L3 11l6 2.3M21 4l-3 16-8-6M21 4L9 14.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="اشتراک‌گذاری در اینستاگرام"
              className="flex size-9 items-center justify-center rounded-full border border-border-line bg-chip text-text-1 transition-colors hover:text-brand"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="اشتراک‌گذاری در واتس‌اپ"
              className="flex size-9 items-center justify-center rounded-full border border-border-line bg-chip text-text-1 transition-colors hover:text-brand"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M4 20l1.3-4.3A8 8 0 1112 20a8 8 0 01-4.3-1.3L4 20z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="کپی لینک"
              className="flex size-9 items-center justify-center rounded-full border border-border-line bg-chip text-text-1 transition-colors hover:text-brand"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M9 13a4 4 0 005.6.8l2-2a4 4 0 00-5.6-5.7l-1 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 11a4 4 0 00-5.6-.8l-2 2a4 4 0 005.6 5.7l1-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {post.tagNames.length > 0 && (
            <div className="mt-9 border-t border-border-line pt-6">
              <div className="text-sm font-bold text-ink">موضوعات مرتبط</div>
              <div className="mt-3.5 flex flex-wrap justify-end gap-2">
                {post.tagNames.map((tag) => (
                  <span key={tag} className="rounded-pill border border-border-line bg-chip px-3.75 py-1.75 text-[13.5px] text-text-1">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
