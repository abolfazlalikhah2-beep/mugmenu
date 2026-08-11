"use client";

import { useActionState, useEffect, useState } from "react";
import { ModalShell } from "@/components/dashboard/modal-shell";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/dashboard/toggle";
import {
  createCustomerAddressAction,
  updateCustomerAddressAction,
  type ActionState,
} from "@/features/customer/routes/actions";
import { menuCopy, type MenuLang } from "@/features/menu/utils/menu-language";

export interface AddressFormValue {
  id: string;
  title: string;
  text: string;
  phone: string;
  isDefault: boolean;
}

const initialState: ActionState = {};

export function AddressModal({
  slug,
  address,
  onClose,
  lang = "fa",
}: {
  slug: string;
  address: AddressFormValue | null;
  onClose: () => void;
  lang?: MenuLang;
}) {
  const action = address
    ? updateCustomerAddressAction.bind(null, slug, address.id)
    : createCustomerAddressAction.bind(null, slug);
  const [state, formAction, pending] = useActionState(action, initialState);
  const [isDefault, setIsDefault] = useState(address?.isDefault ?? false);
  const t = menuCopy(lang);

  useEffect(() => {
    if (state.ok) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <ModalShell
      title={address ? t.editAddress : t.addNewAddress}
      subtitle={t.forDeliveryOrders}
      onClose={onClose}
      footer={
        <button
          type="submit"
          form="address-form"
          disabled={pending}
          className="flex h-[50px] flex-1 items-center justify-center rounded-2xl bg-brand text-base text-white disabled:opacity-60"
        >
          {pending ? t.saving : t.saveAddress}
        </button>
      }
    >
      <form id="address-form" action={formAction} className="flex flex-col gap-3.5">
        <input type="hidden" name="isDefault" value={isDefault ? "on" : "off"} />
        <Input name="title" label={t.addressTitleLabel} placeholder={t.addressTitlePlaceholder} defaultValue={address?.title} required />
        <div className="flex flex-col gap-2">
          <label className="text-right text-[13px] font-light text-text-4">{t.fullAddressLabel}</label>
          <textarea
            name="text"
            rows={3}
            defaultValue={address?.text}
            required
            className="min-h-[84px] rounded-input border border-border-input p-4 text-right text-sm leading-8 outline-none focus:border-brand"
          />
        </div>
        <Input name="phone" label={t.phoneLabel} dir="ltr" className="text-right" defaultValue={address?.phone} required />
        <label className="flex items-center justify-between gap-3 rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-3.5">
          <span className="text-sm">{t.setAsDefault}</span>
          <Toggle checked={isDefault} onChange={setIsDefault} />
        </label>
        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      </form>
    </ModalShell>
  );
}
