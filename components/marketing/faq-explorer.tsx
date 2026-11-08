"use client";

import { useMemo, useState } from "react";
import { faqCategories, faqPageItems, type FaqCategory } from "@/components/marketing/faq-data";

export function FaqExplorer() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<FaqCategory>("عمومی");

  const filtered = useMemo(() => {
    const query = search.trim();
    if (query) {
      return faqPageItems.filter(
        (item) => item.question.includes(query) || item.answer.includes(query),
      );
    }
    return faqPageItems.filter((item) => item.category === activeCategory);
  }, [search, activeCategory]);

  return (
    <>
      <section
        aria-labelledby="faq-page-heading"
        className="relative overflow-hidden bg-gradient-to-b from-[#f3faf4] to-white px-5 pb-9 pt-13"
      >
        <div aria-hidden="true" className="pointer-events-none absolute -right-15 -top-22.5 h-80 w-80 rounded-full bg-brand opacity-12 blur-[44px]" />
        <div aria-hidden="true" className="pointer-events-none absolute top-10 -left-20 h-70 w-70 rounded-full bg-brand opacity-10 blur-[44px]" />

        <div className="relative mx-auto max-w-150 text-center">
          <span className="inline-flex items-center gap-2 rounded-pill bg-brand/10 px-4 py-1.75 text-sm font-medium text-brand">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              <path d="M9.5 9.5a2.5 2.5 0 114 2c-.9.7-1.5 1.2-1.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="12" cy="17" r="0.9" fill="currentColor" />
            </svg>
            سوالات متداول
          </span>

          <h1
            id="faq-page-heading"
            className="mt-4.5 text-[clamp(1.5rem,3.2vw,2.2rem)] font-bold leading-[1.3] tracking-[-0.5px] text-ink"
          >
            پاسخ سوالات شما
          </h1>

          <p className="mx-auto mt-4 max-w-[48ch] text-[14px] font-light leading-[1.9] text-text-1">
            در صورتی که پاسخ سوال خود را پیدا نکردید، با پشتیبانی تماس بگیرید.
          </p>

          <form
            onSubmit={(event) => event.preventDefault()}
            className="mx-auto mt-7 flex max-w-130 items-center gap-3 rounded-input border border-border-input bg-white py-1.5 pl-1.5 pr-4.5 shadow-float"
          >
            <label htmlFor="faq-search" className="sr-only">
              جستجو در سوالات
            </label>
            <input
              id="faq-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="جستجو در سوالات..."
              className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-text-4"
            />
            <button
              type="submit"
              className="shrink-0 rounded-btn bg-brand px-5 py-2.75 text-sm font-semibold text-white shadow-[0_8px_9px_rgba(50,140,61,0.25)] transition-transform hover:scale-[1.02]"
            >
              جستجو
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5" role="tablist" aria-label="دسته‌بندی سوالات">
            {faqCategories.map((category) => {
              const isActive = !search && activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setSearch("");
                    setActiveCategory(category);
                  }}
                  className={`rounded-pill px-4.5 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-brand text-white shadow-[0_8px_9px_rgba(50,140,61,0.25)]" : "bg-chip text-text-1 hover:text-brand"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section aria-label="فهرست سوالات متداول" className="mx-auto max-w-[860px] px-5 py-6">
        <div className="flex flex-col gap-3">
          {filtered.length > 0 ? (
            filtered.map((faq, index) => (
              <details
                key={faq.question}
                open={index === 0}
                className="group rounded-card-sm border border-border-line bg-card shadow-float open:shadow-modal"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3.5 px-5.5 py-5 text-base font-medium text-ink [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <span
                    aria-hidden="true"
                    className="flex-none text-brand transition-transform duration-300 group-open:rotate-180"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </summary>
                <p className="px-5.5 pb-5.5 text-sm font-light leading-[2] text-text-1">{faq.answer}</p>
              </details>
            ))
          ) : (
            <p className="rounded-card-sm border border-border-line bg-card px-6 py-10 text-center text-[14px] font-light text-text-2">
              نتیجه‌ای برای این عبارت پیدا نشد.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
