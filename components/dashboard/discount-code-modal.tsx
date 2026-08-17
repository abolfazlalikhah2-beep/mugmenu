"use client";

import { useActionState, useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import { ModalShell } from "@/components/dashboard/modal-shell";
import { Input } from "@/components/ui/input";
import { JalaliDatePicker } from "@/components/ui/jalali-date-picker";
import { FormToggle } from "@/components/dashboard/form-toggle";
import {
  createDiscountCodeAction,
  updateDiscountCodeAction,
  type ActionState,
} from "@/features/dashboard/routes/actions";

export interface DiscountCodeFormValue {
  id: string;
  name: string;
  code: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
}

const initialState: ActionState = {};

export function DiscountCodeModal({
  discount,
  onClose,
}: {
  discount: DiscountCodeFormValue | null;
  onClose: () => void;
}) {
  const action = discount ? updateDiscountCodeAction.bind(null, discount.id) : createDiscountCodeAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [code, setCode] = useState(discount?.code ?? "");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (state.ok) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function handleCopy() {
    if (!code) return;
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <ModalShell
      title={discount ? "ویرایش کد تخفیف دستی" : "کد تخفیف دستی جدید"}
      subtitle={discount ? "ویرایش کد تخفیف" : "یک کد تخفیف تازه برای مشتریان بسازید"}
      onClose={onClose}
      footer={
        <>
          <button
            type="submit"
            form="discount-code-form"
            disabled={pending}
            className="flex h-[50px] flex-1 items-center justify-center rounded-2xl bg-brand text-base text-white disabled:opacity-60"
          >
            {pending ? "در حال ذخیره…" : "ذخیره تخفیف"}
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
      <form id="discount-code-form" action={formAction} className="flex flex-col gap-[18px]">
        <div className="flex flex-col gap-4 sm:flex-row">
          <Input name="name" label="نام تخفیف" defaultValue={discount?.name} required className="flex-1" />
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-right text-[13px] font-light text-text-4">کد تخفیف</label>
            <div className="flex h-[50px] items-center gap-2 rounded-input border border-border-input py-0 ps-[18px] pe-2 focus-within:border-brand">
              <input
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                dir="ltr"
                required
                placeholder="BAKHTAR20"
                className="min-w-0 flex-1 bg-transparent text-right font-mont text-sm tracking-wider text-ink outline-none placeholder:text-text-4"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-chip"
                aria-label="کپی کد"
              >
                {copied ? <Check size={16} className="text-brand" /> : <Copy size={16} className="text-[#5A5A5A]" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-right text-[13px] font-light text-text-4">توضیحات</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={discount?.description ?? ""}
            className="min-h-[76px] rounded-input border border-border-input p-[12px_16px] text-right text-[13px] leading-[1.9] text-[#555] outline-none focus:border-brand"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-right text-[13px] font-light text-text-4">مدت‌زمان</label>
          <div className="flex gap-3.5">
            <JalaliDatePicker name="startDate" placeholder="از تاریخ" defaultValue={discount?.startDate} className="flex-1" />
            <JalaliDatePicker name="endDate" placeholder="تا تاریخ" defaultValue={discount?.endDate} className="flex-1" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[14px_18px]">
          <div className="text-right">
            <div className="text-sm font-medium">وضعیت فعال</div>
            <div className="mt-0.5 text-xs font-light text-text-3">کد بلافاصله برای مشتری قابل استفاده شود</div>
          </div>
          <FormToggle name="isActive" defaultChecked={discount?.isActive ?? true} />
        </div>

        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      </form>
    </ModalShell>
  );
}
