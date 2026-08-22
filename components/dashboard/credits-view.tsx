"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CreditRow, CreditRowHeader } from "@/components/dashboard/credit-row";
import { CreditSettleModal } from "@/components/dashboard/credit-settle-modal";
import type { CreditRecordRow } from "@/features/credits/services/credit-service";

const FILTERS: { label: string; status?: "UNPAID" | "PARTIAL" | "PAID" }[] = [
  { label: "همه" },
  { label: "تسویه‌نشده", status: "UNPAID" },
  { label: "تسویه جزئی", status: "PARTIAL" },
  { label: "تسویه‌شده", status: "PAID" },
];

export function CreditsView({ records, status }: { records: CreditRecordRow[]; status?: string }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const opened = records.find((r) => r.id === openId) ?? null;

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex flex-wrap gap-2.5">
        {FILTERS.map((f) => {
          const active = f.status === status || (!f.status && !status);
          const href = `/dashboard/credits${f.status ? `?status=${f.status}` : ""}`;
          return (
            <Link
              key={f.label}
              href={href}
              className={cn(
                "flex h-10 items-center rounded-xl px-5 text-sm",
                active
                  ? "bg-brand font-medium text-white"
                  : "bg-card font-normal text-[#777] shadow-[0px_4px_12px_rgba(0,0,0,0.03)]"
              )}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-[22px] bg-card">
        <CreditRowHeader />
        {records.length === 0 && <div className="p-6 text-center text-sm text-text-3">نسیه‌ای ثبت نشده است.</div>}
        {records.map((r, i) => (
          <CreditRow key={r.id} record={r} index={i} onClick={() => setOpenId(r.id)} />
        ))}
      </div>

      {opened && <CreditSettleModal record={opened} onClose={() => setOpenId(null)} />}
    </div>
  );
}
