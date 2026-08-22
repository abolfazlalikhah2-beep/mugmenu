"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/dashboard/primary-button";
import { PaymentCardRow } from "@/components/superadmin/payment-card-row";
import { PaymentCardModal, type PaymentCardFormValue } from "@/components/superadmin/payment-card-modal";

export function PaymentCardsView({ cards }: { cards: PaymentCardFormValue[] }) {
  const [modal, setModal] = useState<"closed" | "create" | string>("closed");
  const editing = modal !== "closed" && modal !== "create" ? (cards.find((c) => c.id === modal) ?? null) : null;

  return (
    <div className="flex flex-col gap-[18px] rounded-[22px] bg-card p-[24px_26px_14px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="text-right">
          <div className="text-[17px] font-semibold">کارت‌های پرداخت</div>
          <div className="mt-1 text-xs font-light text-text-3">
            کارت‌هایی که کسب‌وکارها هنگام پرداخت کارت‌به‌کارت می‌بینند
          </div>
        </div>
        <PrimaryButton onClick={() => setModal("create")}>افزودن کارت جدید</PrimaryButton>
      </div>
      <div className="flex flex-col">
        {cards.length === 0 && <div className="p-6 text-center text-sm text-text-3">هنوز کارتی ثبت نشده است.</div>}
        {cards.map((c, i) => (
          <PaymentCardRow key={c.id} card={c} isFirst={i === 0} onEdit={() => setModal(c.id)} />
        ))}
      </div>
      {modal !== "closed" && (
        <PaymentCardModal card={modal === "create" ? null : editing} onClose={() => setModal("closed")} />
      )}
    </div>
  );
}
