const contactFaqItems = [
  {
    question: "سریع‌ترین راه دریافت پاسخ کدام است؟",
    answer: "چت تلگرام یا واتساپ؛ معمولاً در کمتر از پنج دقیقه پاسخ می‌گیرید.",
  },
  {
    question: "آیا پشتیبانی در تعطیلات هم پاسخگوست؟",
    answer: "بله، چت پشتیبانی در ساعات پاسخگویی حتی در روزهای تعطیل نیز فعال است.",
  },
  {
    question: "برای همکاری تجاری با چه کسی تماس بگیرم؟",
    answer: "درخواست‌های همکاری و فروش سازمانی را از طریق ایمیل رسمی ارسال کنید تا به تیم مربوطه ارجاع شود.",
  },
];

export function ContactFaq() {
  return (
    <section aria-labelledby="contact-faq-heading" className="mx-auto max-w-[820px] px-5 py-10">
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
          id="contact-faq-heading"
          className="mt-4.5 text-[clamp(1.6rem,4vw,2.2rem)] font-bold leading-[1.4] tracking-[-0.4px] text-ink"
        >
          پیش از تماس، این‌ها را ببینید
        </h2>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {contactFaqItems.map((faq, index) => (
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
    </section>
  );
}
