"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createCustomerAction } from "@/features/superadmin/routes/actions";
import type { CreateCustomerActionState } from "@/features/superadmin/routes/actions";

interface PlanOption {
  id: string;
  key: string;
  name: string;
}

const BILLING_CYCLE_OPTIONS: { value: "MONTHLY" | "SIX_MONTH" | "ANNUAL"; label: string }[] = [
  { value: "MONTHLY", label: "ماهانه" },
  { value: "SIX_MONTH", label: "۶ ماهه" },
  { value: "ANNUAL", label: "سالانه" },
];

const initialState: CreateCustomerActionState = {};

/**
 * Business.slug must stay ASCII (it's a printed-QR handle, see onboarding's
 * slug schema) — Persian business names can't be transliterated reliably,
 * so this only keeps characters that are already slug-safe. It's a
 * convenience suggestion the admin can freely overwrite, not a guarantee.
 */
function suggestSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function NewCustomerView({ plans }: { plans: PlanOption[] }) {
  const [state, formAction, pending] = useActionState(createCustomerAction, initialState);
  const [businessName, setBusinessName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [planId, setPlanId] = useState(plans[0]?.id ?? "");
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "SIX_MONTH" | "ANNUAL">("SIX_MONTH");
  const [copied, setCopied] = useState(false);

  function handleBusinessNameChange(value: string) {
    setBusinessName(value);
    if (!slugTouched) setSlug(suggestSlug(value));
  }

  function handleCopy() {
    if (!state.tempPassword) return;
    navigator.clipboard?.writeText(state.tempPassword).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  if (state.ok && state.tempPassword) {
    return (
      <div className="mx-auto flex max-w-[560px] flex-col items-center gap-4 rounded-card bg-card p-[40px_28px] text-center shadow-modal">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF3EB]">
          <Check size={26} className="text-brand" />
        </div>
        <div className="text-lg font-semibold">مشتری با موفقیت اضافه شد</div>
        <p className="text-sm font-light leading-8 text-text-3">
          رمز عبور موقت را همراه با شماره تلفن وارد شده برای مشتری ارسال کنید. این رمز فقط همین یک‌بار نمایش داده می‌شود.
        </p>
        <div className="flex h-[50px] w-full items-center gap-2 rounded-input border border-border-input ps-[18px] pe-2">
          <span dir="ltr" className="min-w-0 flex-1 text-right font-mont text-sm tracking-wider text-ink">
            {state.tempPassword}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-chip"
            aria-label="کپی رمز"
          >
            {copied ? <Check size={16} className="text-brand" /> : <Copy size={16} className="text-[#5A5A5A]" />}
          </button>
        </div>
        <Link
          href={`/superadmin/customers/${state.businessId}`}
          className="flex h-[50px] w-full items-center justify-center rounded-2xl bg-brand text-base font-medium text-white"
        >
          مشاهده جزئیات مشتری
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[640px] flex-col gap-5 rounded-card bg-card p-[28px_26px] shadow-modal sm:p-[36px]">
      <div className="text-right">
        <div className="text-lg font-semibold">افزودن مشتری جدید</div>
        <p className="mt-1 text-[13px] font-light text-text-3">
          حساب کاربری صاحب امتیاز و کسب‌وکار او را مستقیماً ایجاد و روی پلن انتخابی فعال کنید.
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="planId" value={planId} />
        <input type="hidden" name="billingCycle" value={billingCycle} />

        <div className="flex flex-col gap-4 sm:flex-row">
          <Input name="fullName" label="نام و نام خانوادگی صاحب امتیاز" required className="flex-1" />
          <Input name="phone" label="شماره تماس" dir="ltr" className="flex-1 text-right" required />
        </div>

        <Input
          label="نام مجموعه"
          required
          value={businessName}
          onChange={(e) => handleBusinessNameChange(e.target.value)}
        />

        <Input
          label="شناسه پنل (اسلاگ)"
          dir="ltr"
          className="text-right"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          placeholder="مثلاً baradaran"
          required
        />

        <div className="flex flex-col gap-2">
          <label className="text-right text-[13px] font-light text-text-4">پلن</label>
          <div className="flex flex-wrap gap-2.5">
            {plans.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlanId(p.id)}
                className={`flex h-11 items-center rounded-xl border px-4 text-sm font-medium ${
                  planId === p.id ? "border-brand bg-[#F3FAF4] text-brand" : "border-[#E5E5E5] text-[#777]"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-right text-[13px] font-light text-text-4">دوره پرداخت</label>
          <div className="flex flex-wrap gap-2.5">
            {BILLING_CYCLE_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setBillingCycle(o.value)}
                className={`flex h-11 items-center rounded-xl border px-4 text-sm font-medium ${
                  billingCycle === o.value ? "border-brand bg-[#F3FAF4] text-brand" : "border-[#E5E5E5] text-[#777]"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={pending || !planId}
            className="flex h-[50px] flex-1 items-center justify-center rounded-2xl bg-brand text-base font-medium text-white disabled:opacity-60"
          >
            {pending ? "در حال ثبت…" : "افزودن مشتری"}
          </button>
          <Link
            href="/superadmin/customers"
            className="flex h-[50px] w-[120px] items-center justify-center rounded-2xl border border-[#DDD] bg-card text-[15px] text-[#777]"
          >
            انصراف
          </Link>
        </div>
      </form>
    </div>
  );
}
