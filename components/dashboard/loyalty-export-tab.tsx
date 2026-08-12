"use client";

import { useMemo, useState } from "react";
import { Search, Download } from "lucide-react";
import { LoyaltyMembersTable } from "@/components/dashboard/loyalty-members-table";
import { downloadCsv } from "@/features/dashboard/utils/csv-export";
import { computeLoyaltyTier } from "@/features/customer/services/loyalty";
import type { LoyaltyMemberRow } from "@/features/dashboard/services/loyalty-club-aggregation";
import { cn } from "@/lib/utils";

type TierFilter = "ALL" | "GOLD" | "SILVER";

const TIER_CHIPS: { value: TierFilter; label: string }[] = [
  { value: "ALL", label: "همه سطوح" },
  { value: "GOLD", label: "طلایی" },
  { value: "SILVER", label: "نقره‌ای" },
];

export function LoyaltyExportTab({ members }: { members: LoyaltyMemberRow[] }) {
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState<TierFilter>("ALL");

  const filtered = useMemo(() => {
    const q = search.trim();
    return members.filter((m) => {
      const matchesSearch = !q || m.name.includes(q) || m.phone.includes(q);
      const matchesTier = tier === "ALL" || computeLoyaltyTier(m.loyaltyPoints).tier === tier;
      return matchesSearch && matchesTier;
    });
  }, [members, search, tier]);

  function handleExport() {
    downloadCsv(
      "اعضای-باشگاه-مشتریان.csv",
      ["نام", "شماره تلفن", "تاریخ عضویت", "تعداد سفارش", "موجودی کیف‌پول", "سطح"],
      filtered.map((m) => [
        m.name,
        m.phone,
        m.joinedAt.toLocaleDateString("fa-IR"),
        m.orderCount,
        m.walletBalance,
        computeLoyaltyTier(m.loyaltyPoints).tier === "GOLD" ? "طلایی" : "نقره‌ای",
      ])
    );
  }

  return (
    <div className="flex flex-col gap-[16px] sm:gap-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-right">
          <div className="text-[15px] font-semibold sm:text-base">مشتریان باشگاه</div>
          <div className="mt-0.5 text-xs font-light text-text-3">
            {filtered.length.toLocaleString("fa-IR")} از {members.length.toLocaleString("fa-IR")} عضو
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex h-11 min-w-[240px] items-center gap-2.5 rounded-[13px] bg-card px-4 shadow-[0px_4px_12px_rgba(0,0,0,0.03)]">
            <Search size={18} className="text-[#B0B0B0]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جست‌وجوی نام یا شماره…"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-[#B0B0B0]"
            />
          </div>
          {TIER_CHIPS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setTier(c.value)}
              className={cn(
                "flex h-11 items-center rounded-[13px] px-4 text-[13px]",
                tier === c.value
                  ? "bg-brand font-medium text-white"
                  : "border-[0.3px] border-border-chip bg-chip text-[#666]"
              )}
            >
              {c.label}
            </button>
          ))}
          <button
            type="button"
            onClick={handleExport}
            className="flex h-11 items-center gap-2 rounded-[13px] border border-[#DDD] bg-card px-5 text-sm font-medium text-brand"
          >
            <Download size={18} />
            خروجی اکسل
          </button>
        </div>
      </div>
      <LoyaltyMembersTable members={filtered} />
    </div>
  );
}
