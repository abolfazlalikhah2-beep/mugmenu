"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { LoyaltyDashboardTab } from "@/components/dashboard/loyalty-dashboard-tab";
import { CashbackSettingsForm, type CashbackSettingsFormValue } from "@/components/dashboard/cashback-settings-form";
import { BirthdaySettingsForm, type BirthdaySettingsFormValue } from "@/components/dashboard/birthday-settings-form";
import {
  MembershipTierSettingsForm,
  type MembershipTierSettingsFormValue,
} from "@/components/dashboard/membership-tier-settings-form";
import { LoyaltySendTab } from "@/components/dashboard/loyalty-send-tab";
import { LoyaltyExportTab } from "@/components/dashboard/loyalty-export-tab";
import { UpgradeGate } from "@/components/dashboard/upgrade-gate";
import type { LoyaltyClubDashboard } from "@/features/dashboard/services/loyalty-club-service";
import type { LoyaltyFilter, LoyaltyMemberRow } from "@/features/dashboard/services/loyalty-club-aggregation";
import type { FeatureKey } from "@/features/plans/feature-matrix";
import { cn } from "@/lib/utils";

const TABS: { label: string; featureKey?: FeatureKey }[] = [
  { label: "داشبورد" },
  { label: "کش‌بک", featureKey: "loyalty.cashback" },
  { label: "پیام تولد", featureKey: "loyalty.birthday_message" },
  { label: "سطوح عضویت" },
  { label: "ارسال پیام", featureKey: "loyalty.targeted_message" },
  { label: "خروجی", featureKey: "customer.export" },
];

export function LoyaltyClubView({
  dashboard,
  members,
  audienceCounts,
  cashbackSettings,
  birthdaySettings,
  membershipTierSettings,
  featureKeys,
}: {
  dashboard: LoyaltyClubDashboard;
  members: LoyaltyMemberRow[];
  audienceCounts: Record<LoyaltyFilter, number>;
  cashbackSettings: CashbackSettingsFormValue;
  birthdaySettings: BirthdaySettingsFormValue;
  membershipTierSettings: MembershipTierSettingsFormValue;
  featureKeys: string[];
}) {
  const [tab, setTab] = useState(0);
  const has = (key?: FeatureKey) => !key || featureKeys.includes(key);

  return (
    <div className="flex flex-col gap-[16px] sm:gap-[22px]">
      <div className="flex flex-wrap gap-2.5">
        {TABS.map((t, i) => (
          <button
            key={t.label}
            type="button"
            onClick={() => setTab(i)}
            className={cn(
              "flex h-[38px] items-center gap-1.5 rounded-[11px] px-[18px] text-sm",
              tab === i ? "bg-[#EAF3EB] font-medium text-brand" : "font-normal text-[#8A8A8A]"
            )}
          >
            {t.label}
            {!has(t.featureKey) && (
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#F0F0F0] text-[#9A9A9A]">
                <Lock size={9} />
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 0 && <LoyaltyDashboardTab data={dashboard} />}
      {tab === 1 && (
        <UpgradeGate allowed={has("loyalty.cashback")} title="کش‌بک باشگاه مشتریان در پلن شما موجود نیست">
          <CashbackSettingsForm settings={cashbackSettings} />
        </UpgradeGate>
      )}
      {tab === 2 && (
        <UpgradeGate allowed={has("loyalty.birthday_message")} title="پیام تولد در پلن شما موجود نیست">
          <BirthdaySettingsForm settings={birthdaySettings} />
        </UpgradeGate>
      )}
      {tab === 3 && <MembershipTierSettingsForm settings={membershipTierSettings} />}
      {tab === 4 && (
        <UpgradeGate allowed={has("loyalty.targeted_message")} title="ارسال پیام هدفمند در پلن شما موجود نیست">
          <LoyaltySendTab counts={audienceCounts} />
        </UpgradeGate>
      )}
      {tab === 5 && (
        <UpgradeGate allowed={has("customer.export")} title="خروجی اکسل مشتریان در پلن شما موجود نیست">
          <LoyaltyExportTab members={members} />
        </UpgradeGate>
      )}
    </div>
  );
}
