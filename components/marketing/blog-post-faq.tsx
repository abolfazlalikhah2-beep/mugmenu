import type { BlogFaqItem } from "@/components/marketing/blog-posts-data";

export function BlogPostFaq({ faqs }: { faqs: BlogFaqItem[] }) {
  if (faqs.length === 0) return null;

  return (
    <section aria-labelledby="blog-faq-heading" className="mx-auto max-w-205 px-5 py-11">
      <h2 id="blog-faq-heading" className="text-[clamp(1.4rem,3.6vw,2rem)] font-bold tracking-[-0.3px] text-ink">
        سوالات متداول درباره‌ی این موضوع
      </h2>
      <div className="mt-6 flex flex-col gap-3">
        {faqs.map((item) => (
          <details
            key={item.question}
            className="group rounded-card-sm border border-border-line bg-card shadow-float open:shadow-modal"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3.5 px-5.5 py-5 text-base font-medium text-ink [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <svg
                aria-hidden="true"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="flex-none text-brand transition-transform duration-300 group-open:rotate-180"
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <p className="px-5.5 pb-5.5 text-sm font-light leading-[2] text-text-1">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
