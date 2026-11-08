"use client";

import { useState } from "react";
import { HelpArticleSidebar } from "@/components/marketing/help-article-sidebar";
import type { HelpArticle, HelpCategory } from "@/components/marketing/help-data";

export function HelpArticleContent({
  article,
  category,
  categoryArticles,
}: {
  article: HelpArticle;
  category: HelpCategory | undefined;
  categoryArticles: HelpArticle[];
}) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  return (
    <section className="px-5 pb-14 pt-4">
      <div className="mx-auto flex max-w-220 flex-col-reverse gap-8 lg:flex-row-reverse lg:items-start">
        <HelpArticleSidebar category={category} articles={categoryArticles} activeSlug={article.slug} />

        <article className="flex-1 text-right">
          <p className="text-[15px] font-light leading-[2.1] text-text-1">{article.intro}</p>

          {article.steps && article.steps.length > 0 && (
            <ol className="mt-6 flex flex-col gap-4">
              {article.steps.map((step, index) => (
                <li key={step.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#eaf6ec] text-[12px] font-extrabold text-brand">
                    {(index + 1).toLocaleString("fa-IR")}
                  </span>
                  <span className="text-[14.5px] leading-[1.9]">
                    <span className="font-bold text-ink">{step.title}</span>
                    {step.desc && <span className="mt-0.5 block font-light text-text-2">{step.desc}</span>}
                  </span>
                </li>
              ))}
            </ol>
          )}

          {article.note && (
            <div className="mt-6 flex items-start gap-2.5 rounded-input border border-[#cfe1f5] bg-[#e8f1fb] px-4 py-3.5 text-[13.5px] font-light leading-[1.9] text-[#2a5e94]">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 8v.01M12 11v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span>{article.note}</span>
            </div>
          )}

          <div className="mt-10 flex items-center justify-end gap-3 border-t border-border-line pt-6">
            <span className="text-sm font-bold text-ink">این مقاله مفید بود؟</span>
            <button
              type="button"
              aria-pressed={feedback === "up"}
              onClick={() => setFeedback("up")}
              className={`flex size-9 items-center justify-center rounded-full border transition-colors ${
                feedback === "up" ? "border-brand bg-[#eaf6ec] text-brand" : "border-border-line bg-chip text-text-1 hover:text-brand"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M7 10v10H4V10h3zm3 10V11l2-7a2 2 0 012 2v4h4.2a2 2 0 011.95 2.44l-1.4 6A2 2 0 0117.8 20H10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              aria-pressed={feedback === "down"}
              onClick={() => setFeedback("down")}
              className={`flex size-9 items-center justify-center rounded-full border transition-colors ${
                feedback === "down" ? "border-red-300 bg-red-50 text-red-500" : "border-border-line bg-chip text-text-1 hover:text-red-500"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M17 14V4h3v10h-3zm-3-10v9l-2 7a2 2 0 01-2-2v-4H5.8a2 2 0 01-1.95-2.44l1.4-6A2 2 0 017.2 4H14z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </button>
            {feedback && <span className="text-xs font-light text-text-3">ممنون از بازخوردت!</span>}
          </div>
        </article>
      </div>
    </section>
  );
}
