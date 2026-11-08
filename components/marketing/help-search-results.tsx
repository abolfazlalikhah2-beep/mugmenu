import { HelpArticleList } from "@/components/marketing/help-article-list";
import type { HelpArticle } from "@/components/marketing/help-data";

export function HelpSearchResults({ query, articles }: { query: string; articles: HelpArticle[] }) {
  return (
    <section aria-labelledby="help-search-heading" className="px-5 pb-10 pt-12">
      <div className="mx-auto max-w-[1200px]">
        <h2 id="help-search-heading" className="text-right text-xl font-black text-ink sm:text-2xl">
          نتیجه جستجو برای «{query}»
        </h2>

        {articles.length > 0 ? (
          <div className="mt-6">
            <HelpArticleList articles={articles} />
          </div>
        ) : (
          <p className="mt-6 rounded-card-sm border border-border-line bg-card px-6 py-10 text-center text-[14px] font-light text-text-2">
            نتیجه‌ای برای این عبارت پیدا نشد. می‌توانید با تیم پشتیبانی تماس بگیرید.
          </p>
        )}
      </div>
    </section>
  );
}
