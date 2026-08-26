const faqs = [
  {
    question: "آیا نیاز به نصب اپلیکیشن دارد؟",
    answer:
      "خیر. مشتریان با اسکن QR کد یا لینک اختصاصی رستوران، منو را مستقیم در مرورگر موبایل یا دسکتاپ خود می‌بینند و سفارش می‌دهند؛ نیازی به نصب هیچ اپلیکیشنی نیست.",
  },
  {
    question: "چطور می‌توانم پلن را ارتقا دهم؟",
    answer:
      "از پنل مدیریت، بخش «حساب کاربری»، هر زمان که خواستید می‌توانید پلن جدید را انتخاب و پرداخت را تکمیل کنید؛ دسترسی به امکانات پلن جدید بلافاصله فعال می‌شود.",
  },
  {
    question: "آیا تخفیف سالانه دارید؟",
    answer: "بله، با انتخاب صورت‌حساب سالانه به‌جای ماهانه، ٪۲۰ در کل هزینه‌ی اشتراک صرفه‌جویی می‌کنید.",
  },
  {
    question: "اگر بعداً به سفارش‌گیری آنلاین نیاز پیدا کردم چه کار کنم؟",
    answer:
      "می‌توانید از همان پلن رایگان «منو دیداری» شروع کنید و هر زمان به سفارش‌گیری روی میز، بیرون‌بر یا ارسال با پیک نیاز داشتید، به پلن «منو سفارش» یا «منو پیشرفته» ارتقا دهید — منو و اطلاعات رستوران‌تان بدون تغییر باقی می‌ماند.",
  },
];

export function PricingFaq() {
  return (
    <section aria-labelledby="pricing-faq-heading" className="relative mx-auto max-w-205 px-5 py-17.5">
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
          id="pricing-faq-heading"
          className="mt-4.5 text-[clamp(1.6rem,4vw,2.5rem)] font-bold leading-[1.4] tracking-[-0.4px] text-ink"
        >
          سوالات درباره‌ی تعرفه‌ها
        </h2>
      </div>

      <div className="mt-10 flex flex-col gap-3.5">
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
