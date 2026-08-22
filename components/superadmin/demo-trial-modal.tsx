"use client";

import { useActionState, useEffect, useState } from "react";
import { ModalShell } from "@/components/dashboard/modal-shell";
import { Toggle } from "@/components/dashboard/toggle";
import { JalaliDatePicker } from "@/components/ui/jalali-date-picker";
import { updateBusinessDemoAction, type ActionState } from "@/features/superadmin/routes/actions";

const PRESET_DAYS = [
  { label: "۷+ روز", days: 7 },
  { label: "۱۴+ روز", days: 14 },
  { label: "۳۰+ روز", days: 30 },
] as const;

function isoDateOf(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function isoFromToday(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return isoDateOf(d);
}

const initialState: ActionState = {};

export function DemoTrialModal({
  businessId,
  storeName,
  isDemoActive,
  demoActiveNow,
  demoExpiresAt,
  onClose,
}: {
  businessId: string;
  storeName: string;
  isDemoActive: boolean;
  demoActiveNow: boolean;
  demoExpiresAt: Date | null;
  onClose: () => void;
}) {
  const action = updateBusinessDemoAction.bind(null, businessId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const [active, setActive] = useState(isDemoActive);
  const [isoDate, setIsoDate] = useState(demoExpiresAt ? isoDateOf(demoExpiresAt) : "");

  useEffect(() => {
    if (state.ok) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <ModalShell
      title="مدیریت دمو آزمایشی"
      subtitle={`دسترسی موقت به پلن پیشرفته برای «${storeName}»`}
      onClose={onClose}
      maxWidth={520}
      footer={
        <>
          <button
            type="submit"
            form="demo-trial-form"
            disabled={pending}
            className="flex h-[50px] flex-1 items-center justify-center rounded-2xl bg-brand text-base font-medium text-white disabled:opacity-60"
          >
            {pending ? "در حال ذخیره…" : "ذخیره تنظیمات دمو"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[50px] w-[120px] items-center justify-center rounded-2xl border border-[#DDD] bg-card text-[15px] text-[#777]"
          >
            انصراف
          </button>
        </>
      }
    >
      <form id="demo-trial-form" action={formAction} className="flex flex-col gap-[18px]">
        <div className="flex items-center justify-between rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[14px_18px]">
          <div className="text-right">
            <div className="text-sm font-medium">وضعیت فعلی</div>
            <div className="mt-0.5 text-xs font-light text-text-3">
              {demoActiveNow && demoExpiresAt
                ? `دمو فعال — تا ${demoExpiresAt.toLocaleDateString("fa-IR")}`
                : isDemoActive && demoExpiresAt
                  ? `دمو منقضی شده — تا ${demoExpiresAt.toLocaleDateString("fa-IR")}`
                  : "دمو فعال نیست"}
            </div>
          </div>
          {demoActiveNow && (
            <span className="whitespace-nowrap rounded-[9px] bg-[#EAF1FE] px-3 py-[5px] text-xs font-medium text-[#2563EB]">
              در حال اجرا
            </span>
          )}
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-[#F0F0F0] p-[14px_18px]">
          <div className="text-right">
            <div className="text-sm font-medium">فعال‌سازی دمو</div>
            <div className="mt-0.5 text-xs font-light leading-6 text-text-3">
              وقتی فعال باشد و تاریخ انقضا نگذشته باشد، این کسب‌وکار مثل پلن «منو پیشرفته» رفتار می‌کند.
            </div>
          </div>
          <Toggle checked={active} onChange={setActive} />
        </div>
        <input type="hidden" name="isDemoActive" value={active ? "true" : "false"} />

        {active && (
          <>
            <JalaliDatePicker
              key={isoDate}
              name="demoExpiresAt"
              label="تاریخ انقضای دمو"
              defaultValue={isoDate}
              placeholder="تاریخ انقضا را انتخاب کنید"
            />
            <div className="flex flex-wrap gap-2">
              {PRESET_DAYS.map((p) => (
                <button
                  key={p.days}
                  type="button"
                  onClick={() => setIsoDate(isoFromToday(p.days))}
                  className="h-[38px] rounded-xl border border-dashed border-brand px-4 text-[13px] font-medium text-brand"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </>
        )}

        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      </form>
    </ModalShell>
  );
}
