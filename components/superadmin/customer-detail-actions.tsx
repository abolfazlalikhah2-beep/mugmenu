"use client";

import { useTransition } from "react";
import Link from "next/link";
import { renewSubscriptionAction, toggleSuspendBusinessAction } from "@/features/superadmin/routes/actions";

export function CustomerDetailActions({
  businessId,
  storeName,
  isSuspended,
}: {
  businessId: string;
  storeName: string;
  isSuspended: boolean;
}) {
  const [renewPending, startRenew] = useTransition();
  const [suspendPending, startSuspend] = useTransition();

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

  return (
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
  );
}
