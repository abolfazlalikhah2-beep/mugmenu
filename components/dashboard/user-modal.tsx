"use client";

import { useActionState, useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import { ModalShell } from "@/components/dashboard/modal-shell";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  createStaffUserAction,
  updateStaffUserAction,
  type ActionState,
} from "@/features/dashboard/routes/actions";
import type { StaffRole } from "@/components/dashboard/user-row";

const ROLE_OPTIONS: { value: StaffRole; name: string; desc: string }[] = [
  { value: "OWNER", name: "مدیر کل", desc: "دسترسی کامل به همه بخش‌ها و تنظیمات" },
  { value: "MENU_MANAGER", name: "مدیر منو", desc: "مدیریت محصولات، دسته‌ها و تخفیف‌ها" },
  { value: "CASHIER", name: "صندوق", desc: "مشاهده و مدیریت سفارشات و پرداخت" },
];

export interface StaffUserFormValue {
  id: string;
  fullName: string;
  phone: string;
  role: StaffRole;
}

const initialState: ActionState = {};

export function UserModal({
  user,
  onClose,
}: {
  user: StaffUserFormValue | null;
  onClose: () => void;
}) {
  const action = user ? updateStaffUserAction.bind(null, user.id) : createStaffUserAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [role, setRole] = useState<StaffRole>(user?.role ?? "OWNER");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (state.ok && !state.tempPassword) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function handleCopy() {
    if (!state.tempPassword) return;
    navigator.clipboard?.writeText(state.tempPassword).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  if (state.ok && state.tempPassword) {
    return (
      <ModalShell
        title="کاربر با موفقیت اضافه شد"
        subtitle="رمز عبور موقت را برای کاربر ارسال کنید"
        onClose={onClose}
        footer={
          <button
            type="button"
            onClick={onClose}
            className="flex h-[50px] flex-1 items-center justify-center rounded-2xl bg-brand text-base text-white"
          >
            متوجه شدم
          </button>
        }
      >
        <div className="flex flex-col gap-2">
          <label className="text-right text-[13px] font-light text-text-4">رمز عبور موقت</label>
          <div className="flex h-[50px] items-center gap-2 rounded-input border border-border-input ps-[18px] pe-2">
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
          <p className="text-right text-xs font-light leading-7 text-text-3">
            این رمز فقط همین یک‌بار نمایش داده می‌شود. آن را همراه با شماره تلفن وارد شده به کاربر جدید اطلاع دهید
            تا بتواند وارد پنل شود.
          </p>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell
      title={user ? "ویرایش کاربر" : "افزودن کاربر جدید"}
      subtitle={user ? "اطلاعات و سطح دسترسی این کاربر را ویرایش کنید" : "یک عضو تیم با سطح دسترسی مشخص اضافه کن"}
      onClose={onClose}
      footer={
        <>
          <button
            type="submit"
            form="user-form"
            disabled={pending}
            className="flex h-[50px] flex-1 items-center justify-center rounded-2xl bg-brand text-base text-white disabled:opacity-60"
          >
            {pending ? "در حال ذخیره…" : user ? "ذخیره تغییرات" : "افزودن کاربر"}
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
      <form id="user-form" action={formAction} className="flex flex-col gap-[18px]">
        <input type="hidden" name="role" value={role} />
        <div className="flex flex-col gap-4 sm:flex-row">
          <Input name="fullName" label="نام و نام خانوادگی" defaultValue={user?.fullName} required className="flex-1" />
          <Input
            name="phone"
            label="شماره تماس"
            dir="ltr"
            className="flex-1 text-right"
            defaultValue={user?.phone}
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-right text-[13px] font-light text-text-4">سطح دسترسی</label>
          {ROLE_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setRole(o.value)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-2xl border px-[18px] py-4 text-right",
                role === o.value ? "border-brand bg-[#F3FAF4]" : "border-[#E5E5E5] bg-card"
              )}
            >
              <div>
                <div className="text-[15px] font-medium">{o.name}</div>
                <div className="mt-1 text-xs font-light leading-7 text-text-3">{o.desc}</div>
              </div>
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                  role === o.value ? "border-brand" : "border-[#D6D6D6]"
                )}
              >
                {role === o.value && <span className="h-3 w-3 rounded-full bg-brand" />}
              </span>
            </button>
          ))}
        </div>
        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      </form>
    </ModalShell>
  );
}
