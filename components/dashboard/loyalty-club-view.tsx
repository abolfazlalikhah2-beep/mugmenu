"use client";

import { useState } from "react";
import { LoyaltyDashboardTab } from "@/components/dashboard/loyalty-dashboard-tab";
import { CashbackSettingsForm, type CashbackSettingsFormValue } from "@/components/dashboard/cashback-settings-form";
import { BirthdaySettingsForm, type BirthdaySettingsFormValue } from "@/components/dashboard/birthday-settings-form";
import { LoyaltySendTab } from "@/components/dashboard/loyalty-send-tab";
import { LoyaltyExportTab } from "@/components/dashboard/loyalty-export-tab";
import type { LoyaltyClubDashboard } from "@/features/dashboard/services/loyalty-club-service";
import type { LoyaltyFilter, LoyaltyMemberRow } from "@/features/dashboard/services/loyalty-club-aggregation";
import { cn } from "@/lib/utils";

const TABS = ["داشبورد", "کش‌بک", "پیام تولد", "ارسال پیام", "خروجی"] as const;

export function LoyaltyClubView({
  dashboard,
  members,
  audienceCounts,
  cashbackSettings,
  birthdaySettings,
}: {
  dashboard: LoyaltyClubDashboard;
  members: LoyaltyMemberRow[];
  audienceCounts: Record<LoyaltyFilter, number>;
  cashbackSettings: CashbackSettingsFormValue;
  birthdaySettings: BirthdaySettingsFormValue;
}) {
  const [tab, setTab] = useState(0);

  return (
    <div className="flex flex-col gap-[16px] sm:gap-[22px]">
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

      {tab === 0 && <LoyaltyDashboardTab data={dashboard} />}
      {tab === 1 && <CashbackSettingsForm settings={cashbackSettings} />}
      {tab === 2 && <BirthdaySettingsForm settings={birthdaySettings} />}
      {tab === 3 && <LoyaltySendTab counts={audienceCounts} />}
      {tab === 4 && <LoyaltyExportTab members={members} />}
    </div>
  );
}
