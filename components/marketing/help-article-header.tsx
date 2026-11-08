import Link from "next/link";
import type { HelpArticle, HelpCategory } from "@/components/marketing/help-data";

export function HelpArticleHeader({ article, category }: { article: HelpArticle; category: HelpCategory | undefined }) {
  return (
    <header className="px-5 pb-6 pt-10 sm:pt-14">
      <div className="mx-auto max-w-220 text-right">
        <nav aria-label="مسیر" className="flex flex-wrap items-center gap-2 text-[13px] font-light text-text-3">
          <Link href="/help" className="transition-colors hover:text-brand">
            مرکز راهنما
          </Link>
          {category && (
            <>
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-bold text-brand">{category.name}</span>
            </>
          )}
        </nav>

        <h1 className="mt-3 text-[clamp(1.4rem,3.2vw,2rem)] font-black leading-[1.45] tracking-[-0.4px] text-ink">{article.title}</h1>

        <div className="mt-3 text-[13px] font-light text-text-3">
          آخرین به‌روزرسانی: {article.updatedAt} · {article.readMinutes.toLocaleString("fa-IR")} دقیقه مطالعه
        </div>
      </div>
    </header>
  );
}
