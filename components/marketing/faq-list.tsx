import Link from "next/link";
import { faqPageItems } from "@/components/marketing/faq-data";

export function FaqList() {
  return (
    <section aria-label="فهرست سوالات متداول" className="mx-auto max-w-[860px] px-5 py-6">
      <div className="flex flex-col gap-3">
        {faqPageItems.map((faq, index) => (
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
        ))}
      </div>

      <div className="relative mt-8.5 flex flex-wrap items-center justify-between gap-5 overflow-hidden rounded-card bg-gradient-to-br from-[#3ba647] to-[#256b2c] p-8 shadow-[0_26px_41px_rgba(50,140,61,0.20)]">
        <div aria-hidden="true" className="pointer-events-none absolute -left-7.5 -top-15 h-50 w-50 rounded-full bg-white opacity-10 blur-[44px]" />

        <div className="relative flex items-center gap-4">
          <span
            aria-hidden="true"
            className="flex h-13 w-13 flex-none items-center justify-center rounded-input bg-white/18 text-white"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M4 13a8 8 0 0116 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              <rect x="3" y="13" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.7" />
              <rect x="17" y="13" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.7" />
              <path d="M19 20a3 3 0 01-3 3h-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </span>
          <div className="leading-[1.6] text-white">
            <div className="text-lg font-bold">جواب سوالت رو پیدا نکردی؟</div>
            <div className="text-sm font-light opacity-92">تیم پشتیبانی سِرو آماده‌ی کمک به شماست.</div>
          </div>
        </div>

        <Link
          href="/contact"
          className="relative whitespace-nowrap rounded-input bg-white px-7 py-3.5 text-[15px] font-medium text-brand shadow-[0_8px_17.5px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#f3faf4]"
        >
          تماس با پشتیبانی
        </Link>
      </div>
    </section>
  );
}
