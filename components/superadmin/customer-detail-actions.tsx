"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  changePlanAction,
  renewSubscriptionAction,
  toggleSuspendBusinessAction,
} from "@/features/superadmin/routes/actions";

interface PlanOption {
  id: string;
  key: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
}

export function CustomerDetailActions({
  businessId,
  storeName,
  isSuspended,
  plans,
  currentPlanId,
  currentBillingCycle,
}: {
  businessId: string;
  storeName: string;
  isSuspended: boolean;
  plans: PlanOption[];
  currentPlanId: string;
  currentBillingCycle: "MONTHLY" | "ANNUAL";
}) {
  const [renewPending, startRenew] = useTransition();
  const [suspendPending, startSuspend] = useTransition();
  const [planPending, startPlanChange] = useTransition();
  const [planId, setPlanId] = useState(currentPlanId);
  const [billingCycle, setBillingCycle] = useState(currentBillingCycle);
  const [planError, setPlanError] = useState<string | null>(null);

  function handleRenew() {
    if (!confirm(`تمدید دستی اشتراک «${storeName}» به مدت ۳۰ روز از امروز ثبت شود؟`)) return;
    startRenew(async () => {
      await renewSubscriptionAction(businessId);
    });
  }

  function handleSuspendToggle() {
    const message = isSuspended
      ? `پنل «${storeName}» فعال شود و دوباره سفارش‌گیری ممکن شود؟`
      : `پنل «${storeName}» تعلیق شود؟ دسترسی این کسب‌وکار به پنل مدیریت قطع می‌شود.`;
    if (!confirm(message)) return;
    startSuspend(async () => {
      await toggleSuspendBusinessAction(businessId, !isSuspended);
    });
  }

  function handlePlanChange() {
    if (planId === currentPlanId && billingCycle === currentBillingCycle) return;
    setPlanError(null);
    startPlanChange(async () => {
      const result = await changePlanAction(businessId, planId, billingCycle);
      if (!result.ok) setPlanError(result.error ?? "خطا در تغییر پلن.");
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#EFEFEF] bg-card p-[16px_18px]">
        <span className="text-[13px] font-medium text-text-1">تغییر پلن</span>
        <select
          value={planId}
          onChange={(e) => setPlanId(e.target.value)}
          className="h-10 rounded-xl border border-border-input bg-white px-3 text-[13px]"
        >
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          value={billingCycle}
          onChange={(e) => setBillingCycle(e.target.value as "MONTHLY" | "ANNUAL")}
          className="h-10 rounded-xl border border-border-input bg-white px-3 text-[13px]"
        >
          <option value="MONTHLY">ماهانه</option>
          <option value="ANNUAL">سالانه</option>
        </select>
        <button
          type="button"
          onClick={handlePlanChange}
          disabled={planPending || (planId === currentPlanId && billingCycle === currentBillingCycle)}
          className="flex h-10 items-center justify-center rounded-xl bg-brand px-4 text-[13px] font-medium text-white disabled:opacity-50"
        >
          {planPending ? "در حال ثبت…" : "اعمال تغییر پلن"}
        </button>
        {planError && <span className="text-xs text-red-500">{planError}</span>}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleRenew}
          disabled={renewPending}
          className="flex h-[50px] flex-1 items-center justify-center rounded-2xl bg-brand text-base font-medium text-white disabled:opacity-60"
        >
          {renewPending ? "در حال ثبت…" : "تمدید دستی اشتراک"}
        </button>
        <Link
          href={`/superadmin/tickets?newFor=${businessId}`}
          className="flex h-[50px] w-[150px] items-center justify-center rounded-2xl border border-[#DDD] bg-card text-[15px] text-[#777]"
        >
          ارسال پیام
        </Link>
        <button
          type="button"
          onClick={handleSuspendToggle}
          disabled={suspendPending}
          className="flex h-[50px] w-[130px] items-center justify-center rounded-2xl border text-[15px] disabled:opacity-60"
          style={
            isSuspended
              ? { borderColor: "#CDE6D0", background: "#F3FAF4", color: "#328C3D" }
              : { borderColor: "#F0DADA", background: "#FBECEC", color: "#C15656" }
          }
        >
          {suspendPending ? "..." : isSuspended ? "رفع تعلیق" : "تعلیق پنل"}
        </button>
      </div>
    </div>
  );
}
