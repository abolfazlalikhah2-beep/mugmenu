"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const COLLAPSED_COUNT = 4;

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-start gap-2.5">
      <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#E5F0E6]">
        <Check size={14} className="text-brand" />
      </span>
      <span className="text-sm font-light text-[#444]">{text}</span>
    </div>
  );
}

export function PlanFeaturesCard({ maxUsers, featureLabels }: { maxUsers: number; featureLabels: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const allFeatures = [...featureLabels, `${maxUsers.toLocaleString("fa-IR")} کاربر مدیر`];
  const visibleFeatures = expanded ? allFeatures : allFeatures.slice(0, COLLAPSED_COUNT);
  const canCollapse = allFeatures.length > COLLAPSED_COUNT;

  return (
    <div className="flex flex-col gap-3.5 rounded-[22px] bg-card p-[24px_26px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
      <div className="text-right text-base font-semibold">امکانات پلن شما</div>
      <div className="grid grid-cols-1 gap-x-4 gap-y-3 text-right sm:grid-cols-2">
        {visibleFeatures.map((label) => (
          <Feature key={label} text={label} />
        ))}
      </div>
      {canCollapse && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center justify-center gap-1.5 self-start text-[13px] font-medium text-brand"
        >
          {expanded ? "نمایش کمتر" : "اطلاعات بیشتر"}
          <ChevronDown size={15} className={cn("transition-transform", expanded && "rotate-180")} />
        </button>
      )}
    </div>
  );
}
