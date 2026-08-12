import { Users, Wallet } from "lucide-react";
import { ReportSummaryCard } from "@/components/dashboard/report-summary-card";
import { TrendLineChart } from "@/components/dashboard/trend-line-chart";
import { TrendBarList } from "@/components/dashboard/trend-bar-list";
import { LoyaltyMembersTable } from "@/components/dashboard/loyalty-members-table";
import { formatToman } from "@/features/menu/utils/money";
import { computeDelta } from "@/features/dashboard/services/stat-delta";
import type { LoyaltyClubDashboard } from "@/features/dashboard/services/loyalty-club-service";

export function LoyaltyDashboardTab({ data }: { data: LoyaltyClubDashboard }) {
  const { summary, growth, cashback, latestMembers } = data;
  const monthCashback = cashback[cashback.length - 1]?.count ?? 0;
  const prevMonthCashback = cashback[cashback.length - 2]?.count ?? 0;
  const cashbackDelta = computeDelta(monthCashback, prevMonthCashback);

  return (
    <div className="flex flex-col gap-[16px] sm:gap-[22px]">
      <div className="flex flex-col gap-3.5 sm:flex-row sm:gap-[18px]">
        <ReportSummaryCard
          icon={<Users size={20} className="text-brand" />}
          label="اعضای باشگاه"
          value={summary.totalCount.toLocaleString("fa-IR")}
          unit="عضو"
          deltaPercent={summary.delta.deltaPercent}
          up={summary.delta.up}
          compareLabel={`${summary.newThisMonth.toLocaleString("fa-IR")} عضو این ماه`}
        />
        <ReportSummaryCard
          icon={<Wallet size={20} className="text-brand" />}
          label="کش‌بک این ماه"
          value={formatToman(monthCashback)}
          unit="تومان"
          deltaPercent={cashbackDelta.deltaPercent}
          up={cashbackDelta.up}
          compareLabel="نسبت به ماه قبل"
        />
      </div>

      <div className="grid grid-cols-1 gap-[16px] sm:gap-[22px] lg:grid-cols-[1.6fr_1fr]">
        <TrendLineChart
          points={growth}
          title="رشد اعضای باشگاه"
          subtitle="۱۲ ماه اخیر — عضویت تجمعی"
          legendLabel="اعضا"
          gradientId="loyaltyGrowthFill"
        />
        <TrendBarList
          points={cashback}
          title="کش‌بک پرداخت‌شده"
          subtitle="۶ ماه اخیر — تومان"
          formatValue={(v) => formatToman(v)}
          labelWidthClass="w-12"
          valueWidthClass="w-[70px]"
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="text-right">
          <div className="text-[15px] font-semibold sm:text-base">آخرین اعضای باشگاه</div>
        </div>
        <LoyaltyMembersTable members={latestMembers} />
      </div>
    </div>
  );
}
