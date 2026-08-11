"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AddressRow } from "@/components/customer-account/address-row";
import { AddressModal, type AddressFormValue } from "@/components/customer-account/address-modal";
import { menuCopy, type MenuLang } from "@/features/menu/utils/menu-language";

export function AddressesView({
  slug,
  addresses,
  lang = "fa",
}: {
  slug: string;
  addresses: AddressFormValue[];
  lang?: MenuLang;
}) {
  const [modal, setModal] = useState<"closed" | "create" | string>("closed");
  const editing = modal !== "closed" && modal !== "create" ? addresses.find((a) => a.id === modal) ?? null : null;
  const t = menuCopy(lang);

  return (
    <div className="flex flex-col gap-3 p-4.5">
      {addresses.map((a) => (
        <AddressRow key={a.id} slug={slug} address={a} onEdit={() => setModal(a.id)} lang={lang} />
      ))}

      <button
        type="button"
        onClick={() => setModal("create")}
        className="flex flex-col items-center gap-2 rounded-card-sm border border-dashed border-[#CFCFCF] bg-card p-4.5"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-[13px] bg-brand/10">
          <Plus size={22} className="text-brand" />
        </div>
        <span className="text-[13.5px] font-medium text-brand">{t.addNewAddress}</span>
        <span className="text-[11.5px] font-light text-text-3">{t.forDeliveryOrders}</span>
      </button>

      {modal === "create" && <AddressModal slug={slug} address={null} onClose={() => setModal("closed")} lang={lang} />}
      {editing && <AddressModal slug={slug} address={editing} onClose={() => setModal("closed")} lang={lang} />}
    </div>
  );
}
