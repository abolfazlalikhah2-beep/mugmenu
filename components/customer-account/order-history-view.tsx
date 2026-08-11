"use client";

import { useMemo, useState } from "react";
import { CustomerOrderRow } from "@/components/customer-account/customer-order-row";
import type { CustomerOrderSummary } from "@/features/customer/services/order-history-service";
import { cn } from "@/lib/utils";
import { menuCopy, localizedNumber, type MenuLang } from "@/features/menu/utils/menu-language";

export function OrderHistoryView({
  slug,
  orders,
  lang = "fa",
}: {
  slug: string;
  orders: CustomerOrderSummary[];
  lang?: MenuLang;
}) {
  const [filter, setFilter] = useState(0);
  const t = menuCopy(lang);
  const FILTERS: { label: string; statuses?: CustomerOrderSummary["status"][] }[] = [
    { label: t.filterAll },
    { label: t.filterPreparing, statuses: ["NEW", "PREPARING", "READY"] },
    { label: t.filterDelivered, statuses: ["DELIVERED"] },
    { label: t.filterCanceled, statuses: ["CANCELED"] },
  ];
  const statuses = FILTERS[filter].statuses;

  const filtered = useMemo(
    () => (statuses ? orders.filter((o) => statuses.includes(o.status)) : orders),
    [orders, statuses]
  );

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 overflow-x-auto px-4.5 pt-3.5">
        {FILTERS.map((f, i) => (
          <button
            key={f.label}
            type="button"
            onClick={() => setFilter(i)}
            className={cn(
              "flex h-9 shrink-0 items-center whitespace-nowrap rounded-[11px] px-4 text-[13px]",
              i === filter ? "bg-brand text-white" : "border border-[#EAEAEA] bg-card text-[#777]"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3 p-4.5">
        {filtered.length === 0 && <p className="py-10 text-center text-sm text-text-3">{t.noOrdersFound}</p>}
        {filtered.map((o) => (
          <div key={o.id} className="rounded-card-sm bg-card p-4 shadow-float">
            <CustomerOrderRow slug={slug} order={o} isFirst lang={lang} />
            <div className="mt-2.5 flex items-center justify-between border-t border-[#F4F4F4] pt-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[11.5px] font-light text-text-3">{t.cashbackThisOrder}</span>
                {o.cashbackEarned > 0 && (
                  <span className="text-[12.5px] font-semibold text-brand">
                    + {localizedNumber(lang, o.cashbackEarned)} {lang === "en" ? "T" : "ت"}
                  </span>
                )}
              </div>
              <a
                href={`/${slug}/receipt/${o.id}`}
                className="rounded-[10px] border border-[#EAEAEA] px-3 py-1.5 text-[12.5px] text-[#5F5F5F]"
              >
                {t.invoice}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
