import Link from "next/link";
import type { HelpArticle } from "@/components/marketing/help-data";

export function HelpArticleList({ articles }: { articles: HelpArticle[] }) {
  return (
    <div className="divide-y divide-border-line overflow-hidden rounded-card-sm border border-border-line bg-card">
      {articles.map((article) => (
        <Link
          key={article.slug}
          href={`/help/${article.slug}`}
          className="group flex items-center justify-between gap-4 px-6 py-4.5 transition-colors hover:bg-chip"
        >
          <span aria-hidden="true" className="flex size-6 shrink-0 items-center justify-center text-text-3 transition-transform group-hover:-translate-x-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="min-w-0 flex-1 text-right">
            <span className="block text-[14.5px] font-bold text-ink">{article.title}</span>
            <span className="mt-1 block text-[12px] font-light text-text-3">به‌روزرسانی: {article.updatedAt}</span>
          </span>
          <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-pill bg-[#eaf6ec] text-brand">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 3h9l4 4v13a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M8 9h6M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
        </Link>
      ))}
    </div>
  );
}
