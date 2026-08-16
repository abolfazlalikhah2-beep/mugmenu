"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Wallet } from "lucide-react";
import { MenuPageShell } from "@/components/menu/menu-page-shell";
import { TopBar } from "@/components/menu/top-bar";
import { DeliveryTabs } from "@/components/menu/delivery-tabs";
import { CartLine } from "@/components/menu/cart-line";
import { MenuImage } from "@/components/menu/menu-image";
import { StaticField } from "@/components/menu/static-field";
import { OrderBillSummary } from "@/components/menu/order-bill-summary";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatToman } from "@/features/menu/utils/money";
import { useCart } from "@/features/menu/client/cart-context";
import { createOrderAction } from "@/features/menu/routes/actions";
import {
  validateOrderDraft,
  estimatedTimeFor,
  fieldLabel,
  computeServiceFee,
  computeTax,
  pickBestAutoDiscount,
  clampRedeemAmount,
  type CartLineForDiscount,
} from "@/features/menu/services/order-flow";
import type { CartCheckoutContext } from "@/features/menu/services/menu-service";
import { menuCopy, orderTypeLabel, type MenuLang } from "@/features/menu/utils/menu-language";

export function CartPageClient({
  lang = "fa",
  checkout,
}: {
  lang?: MenuLang;
  checkout: CartCheckoutContext | null;
}) {
  const { cafeSlug } = useParams<{ cafeSlug: string }>();
  const { items, orderType, clear } = useCart();
  const [customerName, setCustomerName] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const [tableNumber, setTableNumber] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [redeemInput, setRedeemInput] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const t = menuCopy(lang);

  const modeLabel = orderTypeLabel(lang, orderType);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discountLines: CartLineForDiscount[] = items.map((i) => ({
    productId: i.productId,
    categoryId: i.categoryId ?? "",
    lineTotal: i.price * i.qty,
  }));
  const bestDiscount = checkout ? pickBestAutoDiscount(discountLines, checkout.autoDiscounts) : null;
  const discountAmount = bestDiscount?.amount ?? 0;
  const packagingFeeAmount = checkout?.packagingFee ?? 0;
  const serviceFeeAmount = checkout ? computeServiceFee(subtotal, checkout.serviceFeePercent) : 0;
  const taxAmount = checkout ? computeTax(subtotal, checkout.taxPercent) : 0;
  const payableBeforeRedeem = Math.max(0, subtotal + packagingFeeAmount + serviceFeeAmount + taxAmount - discountAmount);

  const walletBalance = checkout?.walletBalance ?? 0;
  const requestedRedeem = Number(redeemInput) || 0;
  const redeemAmount = clampRedeemAmount(requestedRedeem, walletBalance, payableBeforeRedeem);
  const total = payableBeforeRedeem - redeemAmount;

  if (!checkout?.hasOrdering) {
    return (
      <MenuPageShell dir={t.dir}>
        <TopBar title={t.cartTitle} backHref={`/${cafeSlug}`} />
        <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
          <p className="text-sm font-light text-text-1">{t.orderingDisabled}</p>
          <Link href={`/${cafeSlug}/menu`}>
            <Button variant="secondary">{t.viewMenu}</Button>
          </Link>
        </div>
      </MenuPageShell>
    );
  }

  if (items.length === 0) {
    return (
      <MenuPageShell dir={t.dir}>
        <TopBar title={t.cartTitle} backHref={`/${cafeSlug}`} />
        <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
          <p className="text-sm font-light text-text-1">{t.cartEmpty}</p>
          <Link href={`/${cafeSlug}/menu`}>
            <Button variant="secondary">{t.viewMenu}</Button>
          </Link>
        </div>
      </MenuPageShell>
    );
  }

  async function handleSubmit() {
    setError(null);
    const fieldError = validateOrderDraft(
      orderType,
      {
        customerName,
        customerPhone,
        tableNumber,
        address,
      },
      lang
    );
    if (fieldError) {
      setError(fieldError);
      return;
    }
    setPending(true);
    try {
      const result = await createOrderAction({
        slug: cafeSlug,
        type: orderType,
        customerName,
        customerPhone,
        tableNumber: orderType === "DINE_IN" ? tableNumber : undefined,
        address: orderType === "DELIVERY" ? address : undefined,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.qty,
          selectedOptionIds: (i.selectedOptions ?? []).map((o) => o.optionId),
          note: i.note,
        })),
        redeemAmount,
      });
      if (result.error) {
        setError(result.error);
        setPending(false);
        return;
      }
      clear();
    } catch {
      setError(t.orderFailed);
      setPending(false);
    }
  }

  return (
    <MenuPageShell dir={t.dir}>
      <TopBar title={t.cartTitle} backHref={`/${cafeSlug}`} />
      <div className="flex flex-col gap-4 p-4 md:p-8.5">
        <DeliveryTabs lang={lang} />
        <div>
          {items.map((item) => (
            <CartLine key={item.lineId} item={item} lang={lang} />
          ))}
        </div>

        <div className="flex flex-col gap-3 rounded-[18px] border border-[#F0F0F0] bg-[#FAFBFA] p-4.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-1">{t.deliveryDetails}</span>
            <span className="rounded-lg bg-[#E5F0E6] px-2.5 py-0.5 text-[11px] text-brand">
              {modeLabel}
            </span>
          </div>

          <Input
            label={fieldLabel(lang, "customerName")}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <Input
            label={fieldLabel(lang, "customerPhone")}
            dir="ltr"
            className="text-right"
            inputMode="numeric"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />

          {orderType === "DINE_IN" && (
            <Input
              label={fieldLabel(lang, "tableNumber")}
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />
          )}

          {orderType === "TAKEAWAY" && (
            <StaticField label={t.estimatedDeliveryTimeLabel} value={estimatedTimeFor("TAKEAWAY", lang) ?? ""} />
          )}

          {orderType === "DELIVERY" && (
            <>
              <Input
                label={fieldLabel(lang, "address")}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <div className="relative h-[110px] overflow-hidden rounded-input border border-[#E7E7E7]">
                <MenuImage label={t.mapPlaceholder} className="h-full w-full" />
                <MapPin
                  size={28}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full text-brand"
                />
              </div>
              <StaticField label={t.deliveryTimeLabel} value={estimatedTimeFor("DELIVERY", lang) ?? ""} />
            </>
          )}
        </div>

        {walletBalance > 0 && (
          <div className="flex flex-col gap-2.5 rounded-[18px] border border-brand/[0.14] bg-brand/[0.06] p-4.5">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-sm font-medium text-[#2F6B36]">
                <Wallet size={16} />
                {t.useWalletCredit}
              </span>
              <span className="font-mont text-sm font-semibold text-brand">
                {formatToman(walletBalance, lang)} {t.toman}
              </span>
            </div>
            <Input
              type="number"
              dir="ltr"
              className="text-right"
              min={0}
              max={Math.min(walletBalance, payableBeforeRedeem)}
              placeholder="0"
              value={redeemInput}
              onChange={(e) => setRedeemInput(e.target.value)}
            />
          </div>
        )}

        <div className="rounded-[18px] border border-[#F0F0F0] p-4.5">
          <OrderBillSummary
            breakdown={{
              subtotal,
              packagingFeeAmount,
              serviceFeeAmount,
              taxAmount,
              discountAmount,
              discountName: bestDiscount?.discount.name,
              walletRedeemedAmount: redeemAmount,
              total,
            }}
            lang={lang}
          />
        </div>

        {error && <p className="text-right text-xs text-red-500">{error}</p>}

        <Button variant="primary" disabled={pending} onClick={handleSubmit} className="mb-2 w-full">
          {pending ? t.placingOrder : t.placeOrder}
        </Button>
      </div>
    </MenuPageShell>
  );
}
