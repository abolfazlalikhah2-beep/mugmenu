"use client";

import { useTransition } from "react";
import { MapPin } from "lucide-react";
import { deleteCustomerAddressAction, setDefaultCustomerAddressAction } from "@/features/customer/routes/actions";
import { cn } from "@/lib/utils";
import type { AddressFormValue } from "@/components/customer-account/address-modal";

export function AddressRow({
  slug,
  address,
  onEdit,
}: {
  slug: string;
  address: AddressFormValue;
  onEdit: () => void;
}) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`آدرس «${address.title}» حذف شود؟`)) return;
    startTransition(async () => {
      await deleteCustomerAddressAction(slug, address.id);
    });
  }

  function handleSetDefault() {
    startTransition(async () => {
      await setDefaultCustomerAddressAction(slug, address.id);
    });
  }

  return (
    <div
      className={cn(
        "rounded-card-sm bg-card p-4.5 shadow-float",
        address.isDefault && "border border-brand/30",
        pending && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <div
            className={cn(
              "flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[13px]",
              address.isDefault ? "bg-brand/10" : "bg-chip"
            )}
          >
            <MapPin size={20} className={address.isDefault ? "text-brand" : "text-[#9A9A9A]"} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[14.5px] font-medium">{address.title}</span>
              {address.isDefault && (
                <span className="rounded-lg bg-brand/10 px-2 py-1 text-[11px] font-medium text-brand">پیش‌فرض</span>
              )}
            </div>
            <div className="mt-1 text-xs font-light leading-7 text-text-3">{address.text}</div>
            <div dir="ltr" className="mt-1 text-right text-xs font-light text-text-4">
              {address.phone}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-2 border-t border-[#F4F4F4] pt-3">
        <button type="button" onClick={onEdit} className="rounded-[10px] border border-[#EAEAEA] px-3.5 py-1.5 text-[12.5px] text-[#5F5F5F]">
          ویرایش
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          className="rounded-[10px] bg-[#FBECEC] px-3.5 py-1.5 text-[12.5px] text-[#C15656]"
        >
          حذف
        </button>
        {!address.isDefault && (
          <button
            type="button"
            onClick={handleSetDefault}
            disabled={pending}
            className="mr-auto rounded-[10px] bg-brand/10 px-3.5 py-1.5 text-[12.5px] text-brand"
          >
            انتخاب به‌عنوان پیش‌فرض
          </button>
        )}
      </div>
    </div>
  );
}
