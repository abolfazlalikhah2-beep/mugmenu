"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Search, UtensilsCrossed, ShoppingBag, Bike, Plus } from "lucide-react";
import { ModalShell } from "@/components/dashboard/modal-shell";
import { Input } from "@/components/ui/input";
import {
  requiredFieldsFor,
  validateOrderDraft,
  computeTotal,
  type OrderType,
} from "@/features/menu/services/order-flow";
import { formatToman, toPersianDigits } from "@/features/menu/utils/money";
import { createManualOrderAction, type ActionState } from "@/features/dashboard/routes/actions";
import { cn } from "@/lib/utils";

export interface ManualOrderProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
}

const TYPE_OPTIONS: { value: OrderType; label: string; icon: typeof UtensilsCrossed }[] = [
  { value: "DINE_IN", label: "روی میز", icon: UtensilsCrossed },
  { value: "TAKEAWAY", label: "بیرون‌بر", icon: ShoppingBag },
  { value: "DELIVERY", label: "ارسال", icon: Bike },
];

const initialState: ActionState = {};

function QtyStepper({ qty, onChange }: { qty: number; onChange: (qty: number) => void }) {
  return (
    <div className="flex h-9 items-center overflow-hidden rounded-[11px] border border-[#E3E3E3]">
      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        aria-label="افزایش تعداد"
        className="flex h-full w-[34px] items-center justify-center text-lg text-brand"
      >
        +
      </button>
      <span className="w-[30px] text-center text-sm font-medium">{toPersianDigits(qty)}</span>
      <button
        type="button"
        onClick={() => onChange(qty - 1)}
        aria-label="کاهش تعداد"
        className="flex h-full w-[34px] items-center justify-center text-xl text-[#B0B0B0]"
      >
        −
      </button>
    </div>
  );
}

function orderBadgeLabel(type: OrderType, tableNumber: string, address: string) {
  if (type === "DINE_IN") return tableNumber ? `روی میز · میز ${tableNumber}` : "روی میز";
  if (type === "TAKEAWAY") return "بیرون‌بر";
  return address ? `ارسال · ${address}` : "ارسال با پیک";
}

export function ManualOrderModal({
  products,
  onClose,
}: {
  products: ManualOrderProduct[];
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState(createManualOrderAction, initialState);
  const [type, setType] = useState<OrderType>("DINE_IN");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [address, setAddress] = useState("");
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (state.ok) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const required = requiredFieldsFor(type);

  const filtered = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase())),
    [products, search]
  );

  const items = useMemo(
    () =>
      Object.entries(quantities)
        .filter(([, quantity]) => quantity > 0)
        .map(([productId, quantity]) => ({ productId, quantity })),
    [quantities]
  );

  const priceMap = useMemo(() => new Map(products.map((p) => [p.id, p.price])), [products]);
  const total = computeTotal(items, priceMap);

  const draftError = validateOrderDraft(type, { customerName, customerPhone, tableNumber, address });
  const canSubmit = !draftError && items.length > 0 && !pending;

  function setQty(productId: string, qty: number) {
    setQuantities((prev) => ({ ...prev, [productId]: Math.max(0, qty) }));
  }

  return (
    <ModalShell
      title="ثبت سفارش دستی"
      subtitle="ثبت سریع سفارش توسط اپراتور صندوق"
      maxWidth={720}
      onClose={onClose}
      footer={
        <div className="flex w-full flex-col gap-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-right">
              <div className="text-xs font-light text-text-3">
                {items.length.toLocaleString("fa-IR")} آیتم انتخاب شده
              </div>
              <div className="text-xl font-bold text-brand">{formatToman(total)} تومان</div>
            </div>
            <span className="whitespace-nowrap rounded-[9px] bg-[#E5F0E6] px-3 py-[5px] text-xs font-medium text-brand">
              {orderBadgeLabel(type, tableNumber, address)}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              form="manual-order-form"
              disabled={!canSubmit}
              className="flex h-[52px] flex-1 items-center justify-center rounded-2xl bg-brand text-base font-medium text-white disabled:opacity-60"
            >
              {pending ? "در حال ثبت…" : "ثبت سفارش"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-[52px] w-[120px] items-center justify-center rounded-2xl border border-[#DDD] bg-card text-[15px] text-[#777]"
            >
              انصراف
            </button>
          </div>
        </div>
      }
    >
      <form id="manual-order-form" action={formAction} className="flex flex-col gap-[18px]">
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="items" value={JSON.stringify(items)} />

        <div className="flex flex-col gap-4 sm:flex-row">
          <Input
            name="customerName"
            label="نام مشتری"
            placeholder="مثلاً علی رضایی"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="flex-1"
          />
          <Input
            name="customerPhone"
            label="شماره موبایل"
            placeholder="0912 000 0000"
            dir="ltr"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="flex-1 text-right"
          />
        </div>

        {(required.includes("tableNumber") || required.includes("address")) && (
          <div className="flex flex-col gap-4 sm:flex-row">
            {required.includes("tableNumber") && (
              <Input
                name="tableNumber"
                label="شماره میز"
                placeholder="مثلاً ۷"
                dir="ltr"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="flex-1 text-right"
              />
            )}
            {required.includes("address") && (
              <Input
                name="address"
                label="آدرس تحویل"
                placeholder="آدرس کامل مشتری"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="flex-1"
              />
            )}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-right text-[13px] font-light text-text-4">نوع سفارش</label>
          <div className="flex gap-2.5">
            {TYPE_OPTIONS.map((t) => {
              const active = t.value === type;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={cn(
                    "flex h-12 flex-1 items-center justify-center gap-2 rounded-[13px] text-sm",
                    active
                      ? "bg-brand font-medium text-white"
                      : "border-[0.3px] border-border-chip bg-chip text-[#666]"
                  )}
                >
                  <t.icon size={20} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-3">
            <label className="text-[13px] font-light text-text-4">انتخاب آیتم</label>
            <div className="flex h-11 w-[190px] items-center gap-2.5 rounded-[13px] bg-chip px-4 sm:w-[220px]">
              <Search size={16} className="text-[#B0B0B0]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجوی محصول…"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-[#B0B0B0]"
              />
            </div>
          </div>
          <div className="flex max-h-[300px] flex-col gap-1.5 overflow-auto rounded-2xl border border-[#F0F0F0] p-2">
            {filtered.length === 0 && (
              <div className="p-4 text-center text-xs text-text-3">محصولی یافت نشد.</div>
            )}
            {filtered.map((p) => {
              const qty = quantities[p.id] ?? 0;
              const selected = qty > 0;
              return (
                <div
                  key={p.id}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border p-2.5",
                    selected ? "border-[#CDE6D0] bg-[#F3FAF4]" : "border-transparent"
                  )}
                >
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[#F2F2F2]">
                    {p.imageUrl && (
                      <Image src={p.imageUrl} alt={p.name} fill sizes="44px" className="object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 text-right">
                    <div className="truncate text-sm font-medium">{p.name}</div>
                    <div className="mt-0.5 text-xs font-semibold text-brand">{formatToman(p.price)} ت</div>
                  </div>
                  {selected ? (
                    <QtyStepper qty={qty} onChange={(q) => setQty(p.id, q)} />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setQty(p.id, 1)}
                      aria-label={`افزودن ${p.name}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#EAF3EB] text-brand"
                    >
                      <Plus size={18} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      </form>
    </ModalShell>
  );
}
