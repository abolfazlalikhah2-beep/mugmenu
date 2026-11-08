import { HelpArticleList } from "@/components/marketing/help-article-list";
import type { HelpArticle } from "@/components/marketing/help-data";

export function HelpLatestUpdates({ articles }: { articles: HelpArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="help-updates-heading" className="px-5 py-10">
      <div className="mx-auto max-w-[1200px]">
        <h2 id="help-updates-heading" className="text-right text-xl font-black text-ink sm:text-2xl">
          آخرین به‌روزرسانی‌ها
        </h2>
        <div className="mt-6">
          <HelpArticleList articles={articles} />
        </div>
      </div>
    </section>
  );
}
