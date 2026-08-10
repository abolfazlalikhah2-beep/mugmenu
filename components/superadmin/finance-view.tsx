import { Wallet, LineChart, Store, AlertTriangle } from "lucide-react";
import { FinanceStatCard } from "@/components/superadmin/finance-stat-card";
import { TransactionRow } from "@/components/superadmin/transaction-row";
import { ExportTransactionsButton } from "@/components/superadmin/export-transactions-button";
import { GatewayStatusRow } from "@/components/superadmin/gateway-status-row";
import { GatewaySettingsForm } from "@/components/superadmin/gateway-settings-form";
import type { FinanceTransactionRow } from "@/features/superadmin/services/finance-service";

export interface FinanceStats {
  revenueThisMonth: { value: number; deltaPercent: number; up: boolean };
  revenueThisYear: { value: number; deltaPercent: number; up: boolean };
  activeSubscriptions: { value: number; newThisMonth: number };
  failedTransactions: { value: number };
}

export interface FinancePlatformSettings {
  gatewayEnabled: boolean;
  zarinpalConnected: boolean;
  zarinpalMerchantId: string | null;
  zarinpalCallbackUrl: string | null;
  zarinpalSandbox: boolean;
  hasApiKey: boolean;
}

export function FinanceView({
  stats,
  transactions,
  gatewaySettings,
}: {
  stats: FinanceStats;
  transactions: FinanceTransactionRow[];
  gatewaySettings: FinancePlatformSettings;
}) {
  return (
    <div className="flex flex-col gap-[22px]">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <FinanceStatCard
          label="درآمد این ماه"
          value={stats.revenueThisMonth.value.toLocaleString("fa-IR")}
          unit="تومان"
          icon={<Wallet size={20} className="text-brand" />}
          deltaPercent={stats.revenueThisMonth.deltaPercent}
          up={stats.revenueThisMonth.up}
          note="نسبت به ماه قبل"
        />
        <FinanceStatCard
          label="درآمد سال جاری"
          value={stats.revenueThisYear.value.toLocaleString("fa-IR")}
          unit="تومان"
          icon={<LineChart size={20} className="text-brand" />}
          deltaPercent={stats.revenueThisYear.deltaPercent}
          up={stats.revenueThisYear.up}
          note="نسبت به سال قبل"
        />
        <FinanceStatCard
          label="اشتراک فعال"
          value={stats.activeSubscriptions.value.toLocaleString("fa-IR")}
          unit="رستوران"
          icon={<Store size={20} className="text-brand" />}
          deltaPercent={stats.activeSubscriptions.newThisMonth}
          up
          note="مشترک جدید در ماه"
        />
        <FinanceStatCard
          label="پرداخت ناموفق"
          value={stats.failedTransactions.value.toLocaleString("fa-IR")}
          unit="تراکنش (۳۰ روز)"
          icon={<AlertTriangle size={20} className="text-brand" />}
          deltaPercent={stats.failedTransactions.value}
          up={false}
          note="نیازمند پیگیری"
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-[22px] lg:grid-cols-[1.75fr_1fr]">
        <div className="flex flex-col gap-[18px] rounded-[22px] bg-card p-[24px_26px_14px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="text-right">
              <div className="text-[17px] font-semibold">ریز تراکنش‌ها</div>
              <div className="mt-1 text-xs font-light text-text-3">پرداخت اشتراک مشتریان</div>
            </div>
            <ExportTransactionsButton transactions={transactions} />
          </div>
          <div className="flex flex-col">
            {transactions.length === 0 && (
              <div className="p-6 text-center text-sm text-text-3">هنوز تراکنشی ثبت نشده است.</div>
            )}
            {transactions.map((t, i) => (
              <TransactionRow key={t.id} tx={t} index={i} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[22px]">
          <div className="flex flex-col gap-[18px] rounded-[22px] bg-card p-[24px_26px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
            <div className="text-right text-[17px] font-semibold">درگاه پرداخت</div>
            <GatewayStatusRow connected={gatewaySettings.zarinpalConnected} enabled={gatewaySettings.gatewayEnabled} />
          </div>
          <div className="flex flex-col gap-[18px] rounded-[22px] bg-card p-[24px_26px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
            <div className="text-right">
              <div className="text-[17px] font-semibold">تنظیمات اتصال</div>
              <div className="mt-1 text-xs font-light text-text-3">کلیدهای درگاه زرین‌پال</div>
            </div>
            <GatewaySettingsForm
              settings={{
                zarinpalMerchantId: gatewaySettings.zarinpalMerchantId ?? "",
                zarinpalCallbackUrl: gatewaySettings.zarinpalCallbackUrl ?? "",
                zarinpalSandbox: gatewaySettings.zarinpalSandbox,
                hasApiKey: gatewaySettings.hasApiKey,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
