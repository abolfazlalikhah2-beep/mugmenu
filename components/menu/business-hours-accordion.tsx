"use client";

import * as React from "react";
import { Clock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FA_WEEK_ORDER, dayLabel, getDayHours, isOpenNow, type DayHours } from "@/features/menu/utils/business-hours";
import { menuCopy, type MenuLang } from "@/features/menu/utils/menu-language";

export function BusinessHoursAccordion({ hours, lang = "fa" }: { hours: DayHours[]; lang?: MenuLang }) {
  const [expanded, setExpanded] = React.useState(false);
  const t = menuCopy(lang);
  const open = isOpenNow(hours);
  const today = new Date().getDay();

  return (
    <div className="overflow-hidden rounded-[18px] border border-[#E3E3E3]">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between bg-[#FAFBFA] px-4 py-3.5"
      >
        <div className="flex items-center gap-2.5">
          <Clock size={18} className="text-brand" />
          <span className="text-sm font-medium">{t.infoHours}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("text-xs font-medium", open ? "text-success" : "text-[#E5484D]")}>
            {open ? t.openNow : t.closedNow}
          </span>
          <ChevronDown size={18} className={cn("text-[#9A9A9A] transition-transform", expanded && "rotate-180")} />
        </div>
      </button>
      {expanded && (
        <div className="flex flex-col gap-0.5 p-2">
          {FA_WEEK_ORDER.map((dayOfWeek) => {
            const day = getDayHours(hours, dayOfWeek);
            const isToday = dayOfWeek === today;
            return (
              <div
                key={dayOfWeek}
                className={cn("flex items-center justify-between rounded-chip px-3.5 py-2.5", isToday && "bg-[#E5F0E6]")}
              >
                <span className={cn("text-[13px]", isToday ? "font-semibold text-[#1E8E4E]" : "text-[#333]")}>
                  {dayLabel(lang, dayOfWeek)}
                </span>
                {!day || day.isClosed ? (
                  <span className="text-xs font-medium text-[#E5484D]">{t.dayClosed}</span>
                ) : (
                  <span
                    dir="ltr"
                    className={cn("font-mont text-xs font-light", isToday ? "text-[#1E8E4E]" : "text-[#666]")}
                  >
                    {day.openTime} - {day.closeTime}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
