"use client";

import { useState } from "react";

export type FaqItem = {
  question: string;
  answer: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3.5">
      {items.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={faq.question} className="rounded-card-sm border border-border-line bg-card shadow-float">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-3.5 px-5.5 py-5 text-start text-base font-medium text-ink"
            >
              <span>{faq.question}</span>
              <span
                aria-hidden="true"
                className={`flex-none text-brand transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            {isOpen && (
              <p className="px-5.5 pb-5.5 text-sm font-light leading-[2] text-text-1">{faq.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
