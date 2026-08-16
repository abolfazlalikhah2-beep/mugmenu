"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { PrimaryButton } from "@/components/dashboard/primary-button";
import { ManualOrderModal, type ManualOrderProduct } from "@/components/dashboard/manual-order-modal";

export function ManualOrderTrigger({ products, allowed }: { products: ManualOrderProduct[]; allowed: boolean }) {
  const [open, setOpen] = useState(false);

  if (!allowed) {
    return (
      <Link
        href="/dashboard/account"
        title="ثبت سفارش دستی در پلن شما موجود نیست، برای ارتقا کلیک کنید"
        className="flex h-[42px] items-center gap-2 rounded-[13px] bg-[#F0F0F0] px-[18px] text-sm font-medium text-[#8A8A8A]"
      >
        <Lock size={15} />
        ثبت سفارش دستی
      </Link>
    );
  }

  return (
    <>
      <PrimaryButton onClick={() => setOpen(true)}>ثبت سفارش دستی</PrimaryButton>
      {open && <ManualOrderModal products={products} onClose={() => setOpen(false)} />}
    </>
  );
}
