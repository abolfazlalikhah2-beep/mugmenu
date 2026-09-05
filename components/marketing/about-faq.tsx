import { FaqAccordion, type FaqItem } from "@/components/marketing/faq-accordion";

const faqs: FaqItem[] = [
  {
    question: "سِرو مناسب چه کسب‌وکارهایی است؟",
    answer: "کافه‌ها، رستوران‌ها، فست‌فودها، قنادی‌ها و هر کسب‌وکار غذایی که به منوی دیجیتال و سفارش‌گیری نیاز دارد.",
  },
  {
    question: "آیا برای شروع هزینه‌ای لازم است؟",
    answer: "خیر، می‌توانید با پلن رایگان شروع کنید و هر زمان به امکانات بیشتر نیاز داشتید ارتقا دهید.",
  },
  {
    question: "راه‌اندازی چقدر طول می‌کشد؟",
    answer: "در کمتر از یک روز؛ ثبت‌نام، ساخت منو و انتشار QR اختصاصی تنها چند دقیقه زمان می‌برد.",
  },
];

export function AboutFaq() {
  return (
    <section aria-labelledby="about-faq-heading" className="mx-auto max-w-205 px-5 py-11.5">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-pill bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path d="M9.5 9.5a2.5 2.5 0 114 2c-.9.7-1.5 1.2-1.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="12" cy="17" r="0.9" fill="currentColor" />
          </svg>
          سوالات متداول
        </span>
        <h2
          id="about-faq-heading"
          className="mt-4.5 text-[clamp(1.35rem,2.6vw,1.75rem)] font-bold leading-[1.4] tracking-[-0.4px] text-ink"
        >
          سوالات پرتکرار
        </h2>
      </div>

      <div className="mt-8">
        <FaqAccordion items={faqs} />
      </div>
    </section>
  );
}
