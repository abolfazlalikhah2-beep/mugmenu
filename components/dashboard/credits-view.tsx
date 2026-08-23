"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreditRow, CreditRowHeader } from "@/components/dashboard/credit-row";
import { CreditSettleModal } from "@/components/dashboard/credit-settle-modal";
import { JalaliDateRangePicker } from "@/components/dashboard/jalali-date-range-picker";
import { downloadCsv } from "@/features/dashboard/utils/csv-export";
import { formatDateRangeForFilename, type DateRange } from "@/features/dashboard/services/date-range-filter";
import type { CreditRecordRow } from "@/features/credits/services/credit-service";

const FILTERS: { label: string; status?: "UNPAID" | "PARTIAL" | "PAID" }[] = [
  { label: "همه" },
  { label: "تسویه‌نشده", status: "UNPAID" },
  { label: "تسویه جزئی", status: "PARTIAL" },
  { label: "تسویه‌شده", status: "PAID" },
];

const STATUS_LABEL: Record<"UNPAID" | "PARTIAL" | "PAID", string> = {
  UNPAID: "تسویه‌نشده",
  PARTIAL: "تسویه جزئی",
  PAID: "تسویه‌شده",
};

export function CreditsView({
  records,
  status,
  from,
  to,
  dateRange,
}: {
  records: CreditRecordRow[];
  status?: string;
  from?: string;
  to?: string;
  dateRange: DateRange | null;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const opened = records.find((r) => r.id === openId) ?? null;

  // Preserves the active custom date range (if any) when switching the status filter.
  const dateQuery = from && to ? `&from=${from}&to=${to}` : "";

  function handleExport() {
    const filenameSuffix = dateRange ? formatDateRangeForFilename(dateRange) : new Date().toLocaleDateString("fa-IR");
    downloadCsv(
      `گزارش-نسیه-${filenameSuffix}.csv`,
      ["مشتری", "شماره تماس", "تاریخ سفارش", "مبلغ", "پرداخت‌شده", "مانده", "وضعیت"],
      records.map((r) => [
        r.customerName,
        r.customerPhone,
        r.orderDate.toLocaleDateString("fa-IR"),
        r.amount,
        r.paidAmount,
        r.remaining,
        STATUS_LABEL[r.status],
      ])
    );
  }

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2.5">
          {FILTERS.map((f) => {
            const active = f.status === status || (!f.status && !status);
            const query = f.status ? `?status=${f.status}${dateQuery}` : dateQuery ? `?${dateQuery.slice(1)}` : "";
            const href = `/dashboard/credits${query}`;
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
        <button
          type="button"
          onClick={handleExport}
          disabled={records.length === 0}
          className="flex h-10 items-center gap-2 rounded-xl border border-[#DDD] bg-card px-5 text-sm font-medium text-brand disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download size={16} />
          خروجی CSV
        </button>
      </div>

      <Suspense fallback={<div className="h-[92px] rounded-[18px] border border-[#E3E3E3] bg-card" />}>
        <JalaliDateRangePicker />
      </Suspense>

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
