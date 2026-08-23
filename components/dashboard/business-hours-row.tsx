"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/dashboard/toggle";
import { dayLabel } from "@/features/menu/utils/business-hours";

export function BusinessHoursRow({
  dayOfWeek,
  isClosed: defaultClosed,
  openTime,
  closeTime,
}: {
  dayOfWeek: number;
  isClosed: boolean;
  openTime: string;
  closeTime: string;
}) {
  const [open, setOpen] = useState(!defaultClosed);

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-input border border-border-input px-4 py-3">
      <span className="w-20 shrink-0 text-sm font-medium">{dayLabel("fa", dayOfWeek)}</span>
      <input type="hidden" name={`day${dayOfWeek}_isClosed`} value={open ? "" : "on"} />
      <Toggle checked={open} onChange={setOpen} />
      {open ? (
        <div className="flex flex-1 items-center gap-2">
          <Input
            name={`day${dayOfWeek}_openTime`}
            dir="ltr"
            className="w-full text-right"
            defaultValue={openTime}
            placeholder="09:00"
          />
          <span className="shrink-0 text-xs font-light text-text-3">تا</span>
          <Input
            name={`day${dayOfWeek}_closeTime`}
            dir="ltr"
            className="w-full text-right"
            defaultValue={closeTime}
            placeholder="22:00"
          />
        </div>
      ) : (
        <>
          <input type="hidden" name={`day${dayOfWeek}_openTime`} value={openTime} />
          <input type="hidden" name={`day${dayOfWeek}_closeTime`} value={closeTime} />
          <span className="flex-1 text-xs font-medium text-[#E5484D]">تعطیل</span>
        </>
      )}
    </div>
  );
}
