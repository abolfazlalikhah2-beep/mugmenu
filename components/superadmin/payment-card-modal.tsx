"use client";

import { useActionState, useEffect } from "react";
import { ModalShell } from "@/components/dashboard/modal-shell";
import { Input } from "@/components/ui/input";
import { FormToggle } from "@/components/dashboard/form-toggle";
import {
  createPaymentCardAction,
  updatePaymentCardAction,
  type ActionState,
} from "@/features/payments/routes/actions";

export interface PaymentCardFormValue {
  id: string;
  bankName: string;
  cardNumber: string;
  accountNumber: string;
  holderName: string;
  isActive: boolean;
}

const initialState: ActionState = {};

export function PaymentCardModal({
  card,
  onClose,
}: {
  card: PaymentCardFormValue | null;
  onClose: () => void;
}) {
  const action = card ? updatePaymentCardAction.bind(null, card.id) : createPaymentCardAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.ok) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <ModalShell
      title={card ? "ویرایش کارت" : "افزودن کارت جدید"}
      subtitle={
        card
          ? "اطلاعات این کارت پرداخت کارت‌به‌کارت را ویرایش کنید"
          : "کارت جدید برای دریافت پرداخت کارت‌به‌کارت اضافه کنید"
      }
      onClose={onClose}
      maxWidth={520}
      footer={
        <>
          <button
            type="submit"
            form="payment-card-form"
            disabled={pending}
            className="flex h-[50px] flex-1 items-center justify-center rounded-2xl bg-brand text-base font-medium text-white disabled:opacity-60"
          >
            {pending ? "در حال ذخیره…" : card ? "ذخیره تغییرات" : "افزودن کارت"}
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
      <form id="payment-card-form" action={formAction} className="flex flex-col gap-[18px]">
        <Input name="holderName" label="نام صاحب کارت" defaultValue={card?.holderName} required className="w-full" />
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="min-w-0 flex-1">
            <Input name="bankName" label="نام بانک" defaultValue={card?.bankName} required className="w-full" />
          </div>
          <div className="min-w-0 flex-1">
            <Input
              name="cardNumber"
              label="شماره کارت"
              dir="ltr"
              className="w-full text-right"
              defaultValue={card?.cardNumber}
              placeholder="۶۰۳۷-۹۹۱۱-۰۰۰۰-۰۰۰۰"
              required
            />
          </div>
        </div>
        <Input
          name="accountNumber"
          label="شماره حساب"
          dir="ltr"
          className="w-full text-right"
          defaultValue={card?.accountNumber}
          required
        />
        <div className="flex items-center justify-between rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[14px_18px]">
          <div className="text-right">
            <div className="text-sm font-medium">وضعیت فعال</div>
            <div className="mt-0.5 text-xs font-light text-text-3">
              کارت غیرفعال در صفحه پرداخت کسب‌وکارها نمایش داده نمی‌شود
            </div>
          </div>
          <FormToggle name="isActive" defaultChecked={card?.isActive ?? true} />
        </div>
        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      </form>
    </ModalShell>
  );
}
