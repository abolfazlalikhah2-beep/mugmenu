"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { UpgradeGate } from "@/components/dashboard/upgrade-gate";
import type { ProductTranslationRow } from "@/components/dashboard/language-settings-tab";
import type { PrinterFormValue } from "@/components/dashboard/printer-modal";
import type { DayHours } from "@/features/menu/utils/business-hours";

// Only one tab is ever visible at a time — loading all seven eagerly ships
// JS for six panels nobody asked to see on this render (a big chunk of it:
// html-to-image/jspdf pulled in transitively by the QR tab's export
// buttons). Split each into its own chunk, fetched only when its tab opens.
const TAB_LOADING = <div className="h-40 animate-pulse rounded-2xl bg-[#F3F3F3]" />;
const BusinessInfoTab = dynamic(() => import("@/components/dashboard/business-info-tab").then((m) => m.BusinessInfoTab), {
  loading: () => TAB_LOADING,
});
const OrderSettingsTab = dynamic(() => import("@/components/dashboard/order-settings-tab").then((m) => m.OrderSettingsTab), {
  loading: () => TAB_LOADING,
});
const MenuAppearanceTab = dynamic(() => import("@/components/dashboard/menu-appearance-tab").then((m) => m.MenuAppearanceTab), {
  loading: () => TAB_LOADING,
});
const LanguageSettingsTab = dynamic(
  () => import("@/components/dashboard/language-settings-tab").then((m) => m.LanguageSettingsTab),
  { loading: () => TAB_LOADING }
);
const QrSettingsTab = dynamic(() => import("@/components/dashboard/qr-settings-tab").then((m) => m.QrSettingsTab), {
  loading: () => TAB_LOADING,
});
const PrinterSettingsTab = dynamic(
  () => import("@/components/dashboard/printer-settings-tab").then((m) => m.PrinterSettingsTab),
  { loading: () => TAB_LOADING }
);
const PaymentTab = dynamic(() => import("@/components/dashboard/payment-tab").then((m) => m.PaymentTab), {
  loading: () => TAB_LOADING,
});

export interface SettingsFormValue {
  slug: string;
  name: string;
  nameEn: string | null;
  phone: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
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
  googleMapsApiKey,
  menuUrl,
}: {
  business: SettingsFormValue;
  printers: PrinterFormValue[];
  products: ProductTranslationRow[];
  featureKeys: string[];
  printerLimit: string | null;
  googleMapsApiKey?: string;
  menuUrl: string;
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
        {tab === 0 && (
          <BusinessInfoTab business={business} hours={business.hours} googleMapsApiKey={googleMapsApiKey} />
        )}
        {tab === 1 && <MenuAppearanceTab business={business} />}
        {tab === 2 && <LanguageSettingsTab business={business} products={products} />}
        {tab === 3 && <OrderSettingsTab business={business} />}
        {tab === 4 && <QrSettingsTab business={business} menuUrl={menuUrl} />}
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
