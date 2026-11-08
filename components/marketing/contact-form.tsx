"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContactMessageAction, type ContactActionState } from "@/features/contact/routes/actions";

const initialState: ContactActionState = {};

const fieldClass =
  "w-full rounded-input border border-border-input bg-white px-4.5 py-3.25 text-sm text-ink placeholder:text-text-4 outline-none transition-colors focus:border-brand";

const subjectOptions = [
  { value: "", label: "انتخاب کنید" },
  { value: "سوال عمومی", label: "سوال عمومی" },
  { value: "پشتیبانی فنی", label: "پشتیبانی فنی" },
  { value: "همکاری تجاری", label: "همکاری تجاری" },
  { value: "پیشنهاد و انتقاد", label: "پیشنهاد و انتقاد" },
];

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactMessageAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} noValidate className="flex flex-col gap-4.5">
      <div className="grid gap-4.5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-name" className="text-[13px] font-semibold text-ink">
            نام و نام خانوادگی
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={80}
            placeholder="مثلاً علی رضایی"
            className={fieldClass}
          />
          {state.fieldErrors?.name && <p className="text-xs text-red-500">{state.fieldErrors.name}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-phone" className="text-[13px] font-semibold text-ink">
            شماره موبایل
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            dir="ltr"
            required
            minLength={10}
            maxLength={20}
            placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"
            className={`${fieldClass} text-end`}
          />
          {state.fieldErrors?.phone && <p className="text-xs text-red-500">{state.fieldErrors.phone}</p>}
        </div>
      </div>

      <div className="grid gap-4.5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-email" className="text-[13px] font-semibold text-ink">
            ایمیل <span className="text-text-4 font-light">(اختیاری)</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            dir="ltr"
            maxLength={120}
            placeholder="name@example.com"
            className={`${fieldClass} text-end`}
          />
          {state.fieldErrors?.email && <p className="text-xs text-red-500">{state.fieldErrors.email}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-subject" className="text-[13px] font-semibold text-ink">
            موضوع
          </label>
          <select id="contact-subject" name="subject" defaultValue="" className={fieldClass}>
            {subjectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className="text-[13px] font-semibold text-ink">
          پیام
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          placeholder="پیام خود را بنویسید..."
          className={`${fieldClass} resize-none`}
        />
        {state.fieldErrors?.message && <p className="text-xs text-red-500">{state.fieldErrors.message}</p>}
      </div>

      {state.ok && (
        <p className="flex items-center gap-2.5 rounded-input border border-[#cfe6d2] bg-[#f7faf7] px-3.5 py-2.5 text-[13px] font-semibold text-[#1f5c26]">
          <span className="flex h-7 w-7 flex-none items-center justify-center rounded-input border border-[#cfe6d2] bg-[#e9f4ea]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          پیام شما ارسال شد؛ به‌زودی تماس می‌گیریم.
        </p>
      )}
      {!state.ok && state.error && !state.fieldErrors && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 self-start rounded-input bg-brand px-6.5 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_9px_rgba(50,140,61,0.25)] transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-disabled"
      >
        {pending ? "در حال ارسال…" : "ارسال پیام"}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M3 11l18-7-7 18-2.5-7.5L3 11z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
      </button>
    </form>
  );
}
