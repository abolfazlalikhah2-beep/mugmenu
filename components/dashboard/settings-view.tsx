"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BusinessInfoTab } from "@/components/dashboard/business-info-tab";
import { OrderSettingsTab } from "@/components/dashboard/order-settings-tab";
import { MenuAppearanceTab } from "@/components/dashboard/menu-appearance-tab";
import { QrSettingsTab } from "@/components/dashboard/qr-settings-tab";
import { PrinterSettingsTab } from "@/components/dashboard/printer-settings-tab";
import { PaymentTab } from "@/components/dashboard/payment-tab";
import type { PrinterFormValue } from "@/components/dashboard/printer-modal";

export interface SettingsFormValue {
  slug: string;
  name: string;
  nameEn: string | null;
  phone: string | null;
  address: string | null;
  openingHoursStart: string | null;
  openingHoursEnd: string | null;
  acceptsDineIn: boolean;
  acceptsTakeaway: boolean;
  acceptsDelivery: boolean;
  prepTimeDineIn: number;
  prepTimeTakeaway: number;
  prepTimeDelivery: number;
  qrShowInfo: boolean;
  qrShowHours: boolean;
  qrShowLogo: boolean;
  acceptsOnlinePayment: boolean;
  acceptsCashPayment: boolean;
  packagingFee: number;
  accentColor: string;
  logoUrl: string | null;
  heroBgKey: string;
  heroImageUrl: string | null;
  heroOverlayOpacity: number;
}

const TABS = ["اطلاعات فروشگاه", "ظاهر منو", "تنظیمات سفارش", "QR Code", "پرینتر", "پرداخت"] as const;

export function SettingsView({
  business,
  printers,
}: {
  business: SettingsFormValue;
  printers: PrinterFormValue[];
}) {
  const [tab, setTab] = useState(0);

  return (
    <div className="flex h-full flex-col gap-[22px]">
      <div className="flex flex-wrap gap-2.5">
        {TABS.map((t, i) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(i)}
            className={cn(
              "flex h-[38px] items-center rounded-[11px] px-[18px] text-sm",
              tab === i ? "bg-[#EAF3EB] font-medium text-brand" : "font-normal text-[#8A8A8A]"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        {tab === 0 && <BusinessInfoTab business={business} />}
        {tab === 1 && <MenuAppearanceTab business={business} />}
        {tab === 2 && <OrderSettingsTab business={business} />}
        {tab === 3 && <QrSettingsTab business={business} />}
        {tab === 4 && <PrinterSettingsTab printers={printers} />}
        {tab === 5 && <PaymentTab business={business} />}
      </div>
    </div>
  );
}
