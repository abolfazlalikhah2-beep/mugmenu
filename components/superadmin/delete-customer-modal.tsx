"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ModalShell } from "@/components/dashboard/modal-shell";
import { deleteCustomerAction } from "@/features/superadmin/routes/actions";

export function DeleteCustomerModal({
  businessId,
  storeName,
  slug,
  onClose,
}: {
  businessId: string;
  storeName: string;
  slug: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [confirmSlug, setConfirmSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startDelete] = useTransition();

  function handleDelete() {
    setError(null);
    startDelete(async () => {
      const result = await deleteCustomerAction(businessId, confirmSlug.trim());
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/superadmin/customers");
    });
  }

  return (
    <ModalShell
      title="حذف دائم مشتری"
      subtitle={`این عملیات «${storeName}» و تمام داده‌های آن را برای همیشه حذف می‌کند.`}
      onClose={onClose}
      maxWidth={520}
      footer={
        <>
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending || confirmSlug.trim() !== slug}
            className="flex h-[50px] flex-1 items-center justify-center rounded-2xl bg-[#C15656] text-base font-medium text-white disabled:opacity-50"
          >
            {pending ? "در حال حذف…" : "حذف دائم"}
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
      <div className="flex flex-col gap-3 rounded-2xl border border-[#F0DADA] bg-[#FBECEC] p-[14px_18px]">
        <p className="text-right text-[13px] leading-6 text-[#9A3E3E]">
          با حذف این کسب‌وکار، منو، سفارش‌ها، مشتریان، کیف‌پول، تیکت‌ها و تمام سوابق آن
          برای همیشه از بین می‌رود و غیرقابل‌بازگشت است.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-right text-[13px] font-medium text-text-1">
          برای تأیید، شناسه پنل «{slug}» را وارد کنید
        </label>
        <input
          type="text"
          dir="ltr"
          value={confirmSlug}
          onChange={(e) => setConfirmSlug(e.target.value)}
          placeholder={slug}
          className="h-11 rounded-input border border-border-input bg-white px-3 text-sm"
        />
      </div>

      {error && <p className="text-right text-xs text-red-500">{error}</p>}
    </ModalShell>
  );
}
