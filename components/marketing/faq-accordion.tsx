"use client";

import { useState } from "react";

const faqs = [
  {
    question: "منوی QR ماگ‌منو چطور کار می‌کند؟",
    answer:
      "کافی است منوی خود را در پنل بسازید؛ ماگ‌منو برای رستوران‌تان یک کد QR تولید می‌کند. مشتری با اسکن آن، منو را در مرورگر می‌بیند و می‌تواند سفارش دهد.",
  },
  {
    question: "آیا مشتری باید اپلیکیشنی نصب کند؟",
    answer:
      "خیر. منو و سفارش کاملاً در مرورگر باز می‌شود و مشتری به هیچ اپلیکیشنی نیاز ندارد؛ فقط اسکن و سفارش.",
  },
  {
    question: "سه حالت سفارش چطور تنظیم می‌شود؟",
    answer:
      "در پنل مدیریت می‌توانید هر یک از حالت‌های «روی میز»، «بیرون‌بر» و «ارسال با پیک» را جداگانه فعال یا غیرفعال کنید.",
  },
  {
    question: "تفاوت پلن‌های اشتراک چیست؟",
    answer:
      "پلن «منو دیداری» رایگان و برای نمایش منوست؛ «منو سفارش» سفارش‌گیری آنلاین و اعلان لحظه‌ای را اضافه می‌کند؛ «منو پیشرفته» گزارش‌گیری پیشرفته و پشتیبانی ۲۴ ساعته دارد.",
  },
  {
    question: "چطور می‌توانم با پشتیبانی تماس بگیرم؟",
    answer: "تیم پشتیبانی ماگ‌منو در تمام ساعات شبانه‌روز از طریق پنل مدیریت یا صفحه تماس با ما در دسترس است.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3.5">
      {faqs.map((faq, index) => {
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
