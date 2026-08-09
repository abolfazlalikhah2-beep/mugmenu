"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/dashboard/primary-button";
import { ManualOrderModal, type ManualOrderProduct } from "@/components/dashboard/manual-order-modal";

export function ManualOrderTrigger({ products }: { products: ManualOrderProduct[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PrimaryButton onClick={() => setOpen(true)}>ثبت سفارش دستی</PrimaryButton>
      {open && <ManualOrderModal products={products} onClose={() => setOpen(false)} />}
    </>
  );
}
