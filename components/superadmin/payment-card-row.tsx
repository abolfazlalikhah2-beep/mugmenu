"use client";

import { useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Toggle } from "@/components/dashboard/toggle";
import { deletePaymentCardAction, togglePaymentCardActiveAction } from "@/features/payments/routes/actions";
import type { PaymentCardFormValue } from "@/components/superadmin/payment-card-modal";

export function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, "");
  const last4 = digits.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

export function PaymentCardRow({
  card,
  isFirst,
  onEdit,
}: {
  card: PaymentCardFormValue;
  isFirst: boolean;
  onEdit: () => void;
}) {
  const [pending, startTransition] = useTransition();

  function handleToggle(next: boolean) {
    startTransition(async () => {
      await togglePaymentCardActiveAction(card.id, next);
    });
  }

  function handleDelete() {
    if (!confirm(`کارت «${card.bankName} ${maskCardNumber(card.cardNumber)}» حذف شود؟`)) return;
    startTransition(async () => {
      await deletePaymentCardAction(card.id);
    });
  }

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 py-3.5"
      style={{ borderTop: isFirst ? "none" : "1px solid #F4F4F4" }}
    >
      <div className="min-w-0 text-right">
        <div className="text-sm font-medium">{card.bankName}</div>
        <div dir="ltr" className="mt-0.5 text-right text-xs font-light text-text-3">
          {maskCardNumber(card.cardNumber)}
        </div>
        <div className="mt-0.5 text-[11px] font-light text-text-4">{card.holderName}</div>
      </div>
      <div className="flex items-center gap-2.5">
        <Toggle checked={card.isActive} onChange={handleToggle} disabled={pending} />
        <button
          type="button"
          onClick={onEdit}
          aria-label="ویرایش کارت"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E4E4E4] text-[#5F5F5F]"
        >
          <Pencil size={15} />
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          aria-label="حذف کارت"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#F0DADA] text-[#C15656] disabled:opacity-60"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
