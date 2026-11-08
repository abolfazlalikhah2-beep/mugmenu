import Link from "next/link";
import { helpCategories, getArticlesByCategory } from "@/components/marketing/help-data";
import { HelpCategoryIcon } from "@/components/marketing/help-category-icon";

export function HelpCategories() {
  return (
    <section aria-labelledby="help-categories-heading" className="px-5 pb-6 pt-12">
      <div className="mx-auto max-w-[1200px]">
        <h2 id="help-categories-heading" className="text-right text-xl font-black text-ink sm:text-2xl">
          دسته‌بندی‌ها
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {helpCategories.map((category) => {
            const articles = getArticlesByCategory(category.slug);
            const firstArticle = articles[0];
            const count = articles.length;

            const content = (
              <>
                <div className="flex items-start justify-between">
                  <span
                    aria-hidden="true"
                    className="flex size-6 items-center justify-center text-text-3 transition-transform group-hover:-translate-x-0.5"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex size-11 items-center justify-center rounded-pill"
                    style={{ backgroundColor: category.iconBg, color: category.iconColor }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <HelpCategoryIcon icon={category.icon} />
                    </svg>
                  </span>
                </div>
                <div className="mt-5 text-right">
                  <div className="text-[15px] font-extrabold text-ink">{category.name}</div>
                  <div className="mt-1 text-[12.5px] font-light text-text-3">{count.toLocaleString("fa-IR")} مقاله</div>
                </div>
              </>
            );

            return firstArticle ? (
              <Link
                key={category.slug}
                href={`/help/${firstArticle.slug}`}
                className="group rounded-card-sm border border-border-line bg-card p-5 shadow-float transition-shadow hover:shadow-modal"
              >
                {content}
              </Link>
            ) : (
              <div key={category.slug} className="rounded-card-sm border border-border-line bg-card p-5 opacity-70">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
