"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const TABS = ["لیست مشتریان", "باشگاه مشتریان"] as const;

export function CustomersView({
  customerList,
  loyaltyClub,
}: {
  customerList: ReactNode;
  loyaltyClub: ReactNode;
}) {
  const [tab, setTab] = useState<0 | 1>(0);

  return (
    <div className="flex h-full flex-col gap-[16px] sm:gap-[22px]">
      <div className="flex w-fit gap-1 rounded-2xl bg-[#EDEFED] p-1 sm:gap-2.5 sm:bg-transparent sm:p-0">
        {TABS.map((t, i) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(i as 0 | 1)}
            className={cn(
              "flex h-10 items-center justify-center rounded-xl px-5 text-sm",
              tab === i ? "bg-card font-medium text-brand sm:bg-[#EAF3EB]" : "font-normal text-[#8A8A8A]"
            )}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === 0 ? customerList : loyaltyClub}
    </div>
  );
}
