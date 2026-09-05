"use client";

import { useState, type FormEvent } from "react";

const PHONE_PATTERN = /^0?9\d{9}$/;

export function LeadCaptureForm({ source }: { source: string }) {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!PHONE_PATTERN.test(phone.trim())) {
      setStatus("error");
      setError("شماره تلفن معتبر نیست.");
      return;
    }

    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), source }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setError(data.error ?? "ثبت درخواست ناموفق بود، دوباره تلاش کنید.");
        return;
      }
      setStatus("ok");
    } catch {
      setStatus("error");
      setError("خطا در ارتباط با سرور.");
    }
  }

  if (status === "ok") {
    return (
      <div className="flex items-center gap-2.5 rounded-input bg-brand/10 px-4.5 py-3.5 text-sm font-medium text-brand">
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-none">
          <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        ثبت شد! به‌زودی با شما تماس می‌گیریم.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2 sm:flex-row sm:items-start">
      <div className="flex-1">
        <input
          type="tel"
          dir="ltr"
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="09xxxxxxxxx"
          aria-label="شماره تلفن"
          className="w-full rounded-input border border-border-input bg-white px-4 py-2.75 text-end text-sm text-ink placeholder:text-text-4 outline-none transition-colors focus:border-brand"
        />
        {status === "error" && error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="whitespace-nowrap rounded-input bg-brand px-5 py-2.75 text-sm font-medium text-white shadow-[0_8px_17.5px_rgba(50,140,61,0.28)] transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? "در حال ثبت…" : "شروع رایگان"}
      </button>
    </form>
  );
}
