"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContactMessageAction, type ContactActionState } from "@/features/contact/routes/actions";

const initialState: ContactActionState = {};

const fieldClass =
  "w-full rounded-input border border-border-input bg-white px-4.5 py-3.25 text-sm text-ink placeholder:text-text-4 outline-none transition-colors focus:border-brand";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactMessageAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} noValidate className="flex flex-col gap-4.5">
      <div className="grid gap-4.5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-name" className="text-[13px] font-light text-text-2">
            نام و نام خانوادگی
          </label>
          <input id="contact-name" name="name" type="text" required minLength={2} maxLength={80} className={fieldClass} />
          {state.fieldErrors?.name && <p className="text-xs text-red-500">{state.fieldErrors.name}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-phone" className="text-[13px] font-light text-text-2">
            شماره تماس
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            dir="ltr"
            required
            minLength={10}
            maxLength={20}
            className={`${fieldClass} text-end`}
          />
          {state.fieldErrors?.phone && <p className="text-xs text-red-500">{state.fieldErrors.phone}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-email" className="text-[13px] font-light text-text-2">
          ایمیل <span className="text-text-4">(اختیاری)</span>
        </label>
        <input id="contact-email" name="email" type="email" dir="ltr" maxLength={120} className={`${fieldClass} text-end`} />
        {state.fieldErrors?.email && <p className="text-xs text-red-500">{state.fieldErrors.email}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="text-[13px] font-light text-text-2">
          پیام شما
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          className={`${fieldClass} resize-none`}
        />
        {state.fieldErrors?.message && <p className="text-xs text-red-500">{state.fieldErrors.message}</p>}
      </div>

      {state.ok && (
        <p className="rounded-input bg-brand/10 px-4.5 py-3 text-sm font-medium text-brand">
          پیام شما ارسال شد؛ تیم سِرو به‌زودی با شما تماس می‌گیرد.
        </p>
      )}
      {!state.ok && state.error && !state.fieldErrors && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-input bg-brand px-6 py-3.5 text-[15px] font-medium text-white shadow-[0_8px_17.5px_rgba(50,140,61,0.28)] transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-disabled"
      >
        {pending ? "در حال ارسال…" : "ارسال پیام"}
      </button>
    </form>
  );
}
