import { Gift, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LoyaltyTierStatus, LoyaltyReward } from "@/features/customer/services/loyalty";

const TIER_LABEL: Record<LoyaltyTierStatus["tier"], string> = {
  SILVER: "سطح نقره‌ای",
  GOLD: "سطح طلایی",
};

export function LoyaltyCard({
  points,
  tier,
  rewards,
}: {
  points: number;
  tier: LoyaltyTierStatus;
  rewards: (LoyaltyReward & { unlocked: boolean })[];
}) {
  const progressPercent = tier.nextTierThreshold
    ? Math.min(100, Math.round((points / tier.nextTierThreshold) * 100))
    : 100;

  return (
    <div className="flex flex-col gap-3.5 rounded-card-sm bg-card p-4.5 shadow-float">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[13px] bg-star/15">
            <Gift size={20} className="text-[#C79A00]" />
          </div>
          <div>
            <div className="text-[13px] font-light text-text-3">امتیاز باشگاه مشتریان</div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="text-xl font-semibold">{points.toLocaleString("fa-IR")}</span>
              <Star size={15} className="fill-star text-star" />
            </div>
          </div>
        </div>
        <span className="rounded-[9px] bg-star/15 px-3 py-1.5 text-xs font-medium text-[#C79A00]">
          {TIER_LABEL[tier.tier]}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-md bg-[#F0F0F0]">
        <div
          className="h-full rounded-md bg-gradient-to-r from-star to-[#E0A800]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      {tier.nextTierThreshold && (
        <div className="flex justify-between">
          <span className="text-[11.5px] font-light text-text-3">
            {tier.pointsToNextTier.toLocaleString("fa-IR")} امتیاز تا سطح طلایی
          </span>
          <span className="text-[11.5px] font-light text-text-3">
            {tier.nextTierThreshold.toLocaleString("fa-IR")} امتیاز
          </span>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {rewards.map((r) => (
          <span
            key={r.label}
            className={cn(
              "rounded-[10px] border-[0.3px] border-border-chip bg-chip px-2.5 py-1.5 text-[11.5px]",
              r.unlocked ? "text-text-1" : "text-text-3"
            )}
          >
            {r.label} · {r.cost.toLocaleString("fa-IR")}
          </span>
        ))}
      </div>
    </div>
  );
}
