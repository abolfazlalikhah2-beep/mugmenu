import Link from "next/link";
import type { HelpArticle, HelpCategory } from "@/components/marketing/help-data";

export function HelpArticleSidebar({
  category,
  articles,
  activeSlug,
}: {
  category: HelpCategory | undefined;
  articles: HelpArticle[];
  activeSlug: string;
}) {
  if (!category || articles.length === 0) return null;

  return (
    <aside className="w-full shrink-0 rounded-card-sm border border-border-line bg-card p-5 shadow-float lg:sticky lg:top-24 lg:w-75">
      <div className="flex items-center justify-between gap-2 text-right">
        <h2 className="text-[15px] font-black text-ink">{category.name}</h2>
        <span aria-hidden="true" className="flex size-7 items-center justify-center rounded-pill bg-chip text-text-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
      </div>

      <nav className="mt-4 flex flex-col gap-1">
        {articles.map((item) => (
          <Link
            key={item.slug}
            href={`/help/${item.slug}`}
            className={`rounded-input px-3 py-2.25 text-right text-[13.5px] transition-colors ${
              item.slug === activeSlug ? "bg-[#eaf6ec] font-bold text-brand" : "font-light text-text-1 hover:bg-chip"
            }`}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
