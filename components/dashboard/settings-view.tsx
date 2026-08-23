"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { BusinessInfoTab } from "@/components/dashboard/business-info-tab";
import { OrderSettingsTab } from "@/components/dashboard/order-settings-tab";
import { MenuAppearanceTab } from "@/components/dashboard/menu-appearance-tab";
import { LanguageSettingsTab, type ProductTranslationRow } from "@/components/dashboard/language-settings-tab";
import { QrSettingsTab } from "@/components/dashboard/qr-settings-tab";
import { PrinterSettingsTab } from "@/components/dashboard/printer-settings-tab";
import { PaymentTab } from "@/components/dashboard/payment-tab";
import { UpgradeGate } from "@/components/dashboard/upgrade-gate";
import type { PrinterFormValue } from "@/components/dashboard/printer-modal";
import type { DayHours } from "@/features/menu/utils/business-hours";

export interface SettingsFormValue {
  slug: string;
  name: string;
  nameEn: string | null;
  phone: string | null;
  address: string | null;
  hours: DayHours[];
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
  serviceFeePercent: number;
  taxPercent: number;
  accentColor: string;
  logoUrl: string | null;
  heroBgKey: string;
  heroImageUrl: string | null;
  heroOverlayOpacity: number;
  bilingualMenuEnabled: boolean;
  askLanguageOnEntry: boolean;
  rememberCustomerLanguage: boolean;
}

const TABS = ["اطلاعات فروشگاه", "ظاهر منو", "زبان", "تنظیمات سفارش", "QR Code", "پرینتر", "پرداخت"] as const;

export function SettingsView({
  business,
  printers,
  products,
  featureKeys,
  printerLimit,
}: {
  business: SettingsFormValue;
  printers: PrinterFormValue[];
  products: ProductTranslationRow[];
  featureKeys: string[];
  printerLimit: string | null;
}) {
  const hasPrinter = featureKeys.includes("printer.connection");
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
              "flex h-[38px] items-center gap-1.5 rounded-[11px] px-[18px] text-sm",
              tab === i ? "bg-[#EAF3EB] font-medium text-brand" : "font-normal text-[#8A8A8A]"
            )}
          >
            {t}
            {i === 5 && !hasPrinter && (
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#F0F0F0] text-[#9A9A9A]">
                <Lock size={9} />
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        {tab === 0 && <BusinessInfoTab business={business} hours={business.hours} />}
        {tab === 1 && <MenuAppearanceTab business={business} />}
        {tab === 2 && <LanguageSettingsTab business={business} products={products} />}
        {tab === 3 && <OrderSettingsTab business={business} />}
        {tab === 4 && <QrSettingsTab business={business} />}
        {tab === 5 && (
          <UpgradeGate allowed={hasPrinter} title="اتصال پرینتر در پلن شما موجود نیست">
            <PrinterSettingsTab printers={printers} limit={printerLimit} />
          </UpgradeGate>
        )}
        {tab === 6 && <PaymentTab business={business} />}
      </div>
    </div>
  );
}
