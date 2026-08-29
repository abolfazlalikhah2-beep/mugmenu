"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Search,
  UtensilsCrossed,
  ShoppingBag,
  Bike,
  Plus,
  Banknote,
  CreditCard,
  HandCoins,
  Loader2,
} from "lucide-react";
import { ModalShell } from "@/components/dashboard/modal-shell";
import { Input } from "@/components/ui/input";
import {
  requiredFieldsFor,
  validateOrderDraft,
  computeTotal,
  type OrderType,
} from "@/features/menu/services/order-flow";
import { formatToman, toPersianDigits } from "@/features/menu/utils/money";
import {
  createManualOrderAction,
  getManualOrderCatalogAction,
  lookupCustomerByPhoneAction,
  type ActionState,
} from "@/features/dashboard/routes/actions";
import type { ManualOrderCatalog } from "@/features/dashboard/services/order-mgmt-service";
import { cn } from "@/lib/utils";

type PaymentMethod = "CASH" | "CARD" | "CREDIT";

const TYPE_OPTIONS: { value: OrderType; label: string; icon: typeof UtensilsCrossed }[] = [
  { value: "DINE_IN", label: "روی میز", icon: UtensilsCrossed },
  { value: "TAKEAWAY", label: "بیرون‌بر", icon: ShoppingBag },
  { value: "DELIVERY", label: "ارسال", icon: Bike },
];

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; icon: typeof Banknote }[] = [
  { value: "CASH", label: "نقدی", icon: Banknote },
  { value: "CARD", label: "کارتخوان", icon: CreditCard },
  { value: "CREDIT", label: "نسیه", icon: HandCoins },
];

const initialState: ActionState = {};
const PHONE_LOOKUP_MIN_LENGTH = 6;
const PHONE_LOOKUP_DEBOUNCE_MS = 400;

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
  acceptsDineIn,
  acceptsTakeaway,
  acceptsDelivery,
  onClose,
}: {
  acceptsDineIn: boolean;
  acceptsTakeaway: boolean;
  acceptsDelivery: boolean;
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState(createManualOrderAction, initialState);

  const acceptedByType: Record<OrderType, boolean> = {
    DINE_IN: acceptsDineIn,
    TAKEAWAY: acceptsTakeaway,
    DELIVERY: acceptsDelivery,
  };
  const allowedTypeOptions = TYPE_OPTIONS.filter((t) => acceptedByType[t.value]);

  const [type, setType] = useState<OrderType>(allowedTypeOptions[0]?.value ?? "DINE_IN");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerBirthDate, setCustomerBirthDate] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [address, setAddress] = useState("");
  const [courierId, setCourierId] = useState("");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [creditNote, setCreditNote] = useState("");

  const [catalog, setCatalog] = useState<ManualOrderCatalog | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(true);

  // Lazy-loaded only once the modal has actually mounted (i.e. after the
  // cashier clicked "ثبت سفارش دستی") — the modal itself opens instantly,
  // it just shows a loading state for the product list until this resolves.
  useEffect(() => {
    let cancelled = false;
    getManualOrderCatalogAction().then((result) => {
      if (!cancelled) {
        setCatalog(result);
        setCatalogLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-fills the name only while it's still empty — never overwrites what
  // the cashier already typed.
  useEffect(() => {
    const phone = customerPhone.trim();
    if (phone.length < PHONE_LOOKUP_MIN_LENGTH) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      lookupCustomerByPhoneAction(phone).then((name) => {
        if (!cancelled && name) {
          setCustomerName((current) => (current.trim() ? current : name));
        }
      });
    }, PHONE_LOOKUP_DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [customerPhone]);

  useEffect(() => {
    if (state.ok) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const required = requiredFieldsFor(type);

  const products = useMemo(() => catalog?.products ?? [], [catalog]);
  const categories = catalog?.categories ?? [];
  const couriers = catalog?.couriers ?? [];

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (!categoryId || p.categoryId === categoryId) &&
          p.name.toLowerCase().includes(search.trim().toLowerCase())
      ),
    [products, categoryId, search]
  );

  const items = useMemo(
    () =>
      Object.entries(quantities)
        .filter(([, quantity]) => quantity > 0)
        .map(([productId, quantity]) => ({ productId, quantity })),
    [quantities]
  );

  const priceMap = useMemo(() => new Map(products.map((p) => [p.id, p.price])), [products]);
  const subtotal = computeTotal(items, priceMap);
  const discount = 0; // no discount pipeline applies to manual/POS orders yet
  const total = subtotal - discount;

  const draftError = validateOrderDraft(type, { customerName, customerPhone, tableNumber, address });
  const canSubmit = !draftError && items.length > 0 && allowedTypeOptions.length > 0 && !pending;

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
            <div className="flex flex-col gap-1 text-right">
              <div className="flex items-center justify-between gap-4 text-xs font-light text-text-3">
                <span>جمع جزء ({items.length.toLocaleString("fa-IR")} آیتم)</span>
                <span>{formatToman(subtotal)} تومان</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between gap-4 text-xs font-light text-brand">
                  <span>تخفیف</span>
                  <span>-{formatToman(discount)} تومان</span>
                </div>
              )}
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
        <input type="hidden" name="paymentMethod" value={paymentMethod} />
        <input type="hidden" name="creditNote" value={creditNote} />
        <input type="hidden" name="customerBirthDate" value={customerBirthDate} />
        <input type="hidden" name="courierId" value={type === "DELIVERY" ? courierId : ""} />

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="min-w-0 flex-1">
            <Input
              name="customerName"
              label="نام مشتری"
              placeholder="مثلاً علی رضایی"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="min-w-0 flex-1">
            <Input
              name="customerPhone"
              label="شماره موبایل"
              placeholder="0912 000 0000"
              dir="ltr"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full text-right"
            />
          </div>
          <div className="min-w-0 flex-1">
            <Input
              type="date"
              label="تاریخ تولد (اختیاری)"
              dir="ltr"
              value={customerBirthDate}
              onChange={(e) => setCustomerBirthDate(e.target.value)}
              className="w-full text-right"
            />
          </div>
        </div>

        {(required.includes("tableNumber") || required.includes("address")) && (
          <div className="flex flex-col gap-4 sm:flex-row">
            {required.includes("tableNumber") && (
              <div className="min-w-0 flex-1">
                <Input
                  name="tableNumber"
                  label="شماره میز"
                  placeholder="مثلاً ۷"
                  dir="ltr"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full text-right"
                />
              </div>
            )}
            {required.includes("address") && (
              <div className="min-w-0 flex-1">
                <Input
                  name="address"
                  label="آدرس تحویل"
                  placeholder="آدرس کامل مشتری"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full"
                />
              </div>
            )}
          </div>
        )}

        {type === "DELIVERY" && (
          <div className="flex flex-col gap-2">
            <label className="text-right text-[13px] font-light text-text-4">پیک تحویل (اختیاری)</label>
            <select
              value={courierId}
              onChange={(e) => setCourierId(e.target.value)}
              className="h-[50px] w-full rounded-input border border-border-input bg-white px-[18px] text-right text-sm text-ink outline-none focus:border-brand"
            >
              <option value="">تخصیص بعداً</option>
              {couriers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {couriers.length === 0 && (
              <p className="text-right text-[11px] font-light text-text-3">هنوز پیکی ثبت نشده — از بخش «پیک‌ها» اضافه کنید.</p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-right text-[13px] font-light text-text-4">نوع سفارش</label>
          {allowedTypeOptions.length === 0 ? (
            <p className="rounded-2xl border border-[#F0DADA] bg-[#FBECEC] p-3 text-right text-xs text-[#C15656]">
              هیچ نوع سفارشی برای این مجموعه فعال نیست — از تنظیمات کسب‌وکار فعال کنید.
            </p>
          ) : (
            <div className="flex gap-2.5">
              {allowedTypeOptions.map((t) => {
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
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-right text-[13px] font-light text-text-4">روش پرداخت</label>
          <div className="flex gap-2.5">
            {PAYMENT_OPTIONS.map((p) => {
              const active = p.value === paymentMethod;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPaymentMethod(p.value)}
                  className={cn(
                    "flex h-12 flex-1 items-center justify-center gap-2 rounded-[13px] text-sm",
                    active
                      ? "bg-brand font-medium text-white"
                      : "border-[0.3px] border-border-chip bg-chip text-[#666]"
                  )}
                >
                  <p.icon size={20} />
                  {p.label}
                </button>
              );
            })}
          </div>
          {paymentMethod === "CREDIT" && (
            <div className="flex flex-col gap-2.5 rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[14px_16px]">
              <p className="text-right text-[11px] font-light leading-6 text-text-3">
                برای ثبت نسیه، نام و شماره تماس مشتری الزامی است.
              </p>
              <textarea
                value={creditNote}
                onChange={(e) => setCreditNote(e.target.value)}
                rows={2}
                placeholder="یادداشت نسیه (اختیاری)"
                className="min-h-[54px] rounded-input border border-border-input bg-white p-[10px_14px] text-right text-[13px] leading-[1.8] text-ink outline-none focus:border-brand placeholder:text-[#B7B7B7]"
              />
            </div>
          )}
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

          {categories.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setCategoryId(null)}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-[10px] px-3.5 py-[7px] text-xs",
                  categoryId === null ? "bg-brand font-medium text-white" : "bg-chip text-[#666]"
                )}
              >
                همه
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategoryId(c.id)}
                  className={cn(
                    "shrink-0 whitespace-nowrap rounded-[10px] px-3.5 py-[7px] text-xs",
                    categoryId === c.id ? "bg-brand font-medium text-white" : "bg-chip text-[#666]"
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}

          <div className="flex max-h-[300px] flex-col gap-1.5 overflow-auto rounded-2xl border border-[#F0F0F0] p-2">
            {catalogLoading && (
              <div className="flex flex-col items-center justify-center gap-2 p-8 text-text-3">
                <Loader2 size={22} className="animate-spin text-brand" />
                <span className="text-xs">در حال بارگذاری محصولات…</span>
              </div>
            )}
            {!catalogLoading && filtered.length === 0 && (
              <div className="p-4 text-center text-xs text-text-3">محصولی یافت نشد.</div>
            )}
            {!catalogLoading &&
              filtered.map((p) => {
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
