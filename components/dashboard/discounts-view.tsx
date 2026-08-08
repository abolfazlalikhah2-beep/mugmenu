"use client";

import { useMemo, useState } from "react";
import { Search, Copy, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { PrimaryButton } from "@/components/dashboard/primary-button";
import { DiscountCodeRow } from "@/components/dashboard/discount-code-row";
import { AutoDiscountRow } from "@/components/dashboard/auto-discount-row";
import { DiscountCodeModal } from "@/components/dashboard/discount-code-modal";
import {
  AutoDiscountModal,
  type CategoryOption,
  type ProductOption,
} from "@/components/dashboard/auto-discount-modal";
import { formatDiscountPeriod } from "@/features/dashboard/utils/discount-period";

export interface DiscountRecord {
  id: string;
  type: "CODE" | "AUTOMATIC";
  name: string;
  description: string | null;
  code: string | null;
  percent: number | null;
  scope: "ALL_MENU" | "CATEGORY" | "PRODUCT" | null;
  categoryIds: string[];
  productId: string | null;
  product: { id: string; name: string } | null;
  startDate: Date | null;
  endDate: Date | null;
  isActive: boolean;
}

const TABS = [
  { label: "کد تخفیف دستی", icon: Copy },
  { label: "تخفیف خودکار", icon: Zap },
] as const;

function toDateInput(d: Date | null) {
  return d ? new Date(d).toISOString().slice(0, 10) : null;
}

export function DiscountsView({
  discounts,
  categories,
  products,
}: {
  discounts: DiscountRecord[];
  categories: CategoryOption[];
  products: ProductOption[];
}) {
  const [tab, setTab] = useState<0 | 1>(0);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"closed" | "create" | string>("closed");

  const manual = useMemo(() => discounts.filter((d) => d.type === "CODE"), [discounts]);
  const auto = useMemo(() => discounts.filter((d) => d.type === "AUTOMATIC"), [discounts]);

  const q = search.trim().toLowerCase();
  const filteredManual = useMemo(
    () => manual.filter((d) => d.name.toLowerCase().includes(q) || (d.code ?? "").toLowerCase().includes(q)),
    [manual, q]
  );
  const filteredAuto = useMemo(() => auto.filter((d) => d.name.toLowerCase().includes(q)), [auto, q]);

  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories]);

  function scopeLabel(d: DiscountRecord) {
    if (d.scope === "CATEGORY") {
      const names = d.categoryIds.map((id) => categoryMap.get(id)).filter(Boolean);
      return names.length ? `دسته: ${names.join("، ")}` : "دسته‌بندی";
    }
    if (d.scope === "PRODUCT") return d.product ? `محصول: ${d.product.name}` : "محصول خاص";
    return "کل منو";
  }

  const editingManual = modal !== "closed" && modal !== "create" ? manual.find((d) => d.id === modal) : null;
  const editingAuto = modal !== "closed" && modal !== "create" ? auto.find((d) => d.id === modal) : null;

  return (
    <div className="flex h-full flex-col gap-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex w-fit gap-1 rounded-2xl bg-[#EDEFED] p-[5px]">
          {TABS.map((t, i) => (
            <button
              key={t.label}
              type="button"
              onClick={() => setTab(i as 0 | 1)}
              className={cn(
                "flex h-11 items-center gap-2 rounded-[11px] px-6.5 text-[15px]",
                tab === i ? "bg-card font-medium text-brand shadow-[0_2px_8px_rgba(0,0,0,0.06)]" : "font-normal text-[#7C7C7C]"
              )}
            >
              <t.icon size={18} className={tab === i ? "text-brand" : "text-[#9A9A9A]"} />
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div
            className="flex items-center gap-2.5 rounded-[13px] bg-card px-4"
            style={{ height: 44, width: 300, boxShadow: "0px 4px 12px rgba(0,0,0,0.03)" }}
          >
            <Search size={18} className="text-[#B0B0B0]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی تخفیف…"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-[#B0B0B0]"
            />
          </div>
          <PrimaryButton onClick={() => setModal("create")}>
            {tab === 0 ? "کد تخفیف جدید" : "تخفیف خودکار جدید"}
          </PrimaryButton>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[22px] bg-card p-[8px_6px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
        {tab === 0 ? (
          <>
            <div className="grid min-w-[760px] grid-cols-[1.6fr_1.3fr_2fr_1.4fr_1.2fr_1.2fr] gap-2 p-[12px_18px] text-[13px] font-light text-[#A0A0A0]">
              <span className="text-right">نام</span>
              <span className="text-right">کد</span>
              <span className="text-right">توضیحات</span>
              <span className="text-right">مدت‌زمان</span>
              <span className="text-right">وضعیت</span>
              <span />
            </div>
            {filteredManual.length === 0 ? (
              <div className="p-6 text-center text-sm text-text-3">کد تخفیفی یافت نشد.</div>
            ) : (
              filteredManual.map((d) => (
                <DiscountCodeRow
                  key={d.id}
                  discount={{
                    id: d.id,
                    name: d.name,
                    code: d.code ?? "",
                    description: d.description,
                    period: formatDiscountPeriod(d.startDate, d.endDate),
                    isActive: d.isActive,
                  }}
                  onEdit={() => setModal(d.id)}
                />
              ))
            )}
          </>
        ) : (
          <>
            <div className="grid min-w-[820px] grid-cols-[1.8fr_1fr_1.6fr_1.4fr_1.2fr_1.2fr] gap-2 p-[12px_18px] text-[13px] font-light text-[#A0A0A0]">
              <span className="text-right">نام</span>
              <span className="text-right">درصد</span>
              <span className="text-right">محدوده</span>
              <span className="text-right">مدت‌زمان</span>
              <span className="text-right">وضعیت</span>
              <span />
            </div>
            {filteredAuto.length === 0 ? (
              <div className="p-6 text-center text-sm text-text-3">تخفیف خودکاری یافت نشد.</div>
            ) : (
              filteredAuto.map((d) => (
                <AutoDiscountRow
                  key={d.id}
                  discount={{
                    id: d.id,
                    name: d.name,
                    percent: d.percent ?? 0,
                    scopeLabel: scopeLabel(d),
                    period: formatDiscountPeriod(d.startDate, d.endDate),
                    isActive: d.isActive,
                  }}
                  onEdit={() => setModal(d.id)}
                />
              ))
            )}
          </>
        )}
      </div>

      {modal === "create" && tab === 0 && <DiscountCodeModal discount={null} onClose={() => setModal("closed")} />}
      {modal === "create" && tab === 1 && (
        <AutoDiscountModal categories={categories} products={products} discount={null} onClose={() => setModal("closed")} />
      )}
      {editingManual && (
        <DiscountCodeModal
          discount={{
            id: editingManual.id,
            name: editingManual.name,
            code: editingManual.code ?? "",
            description: editingManual.description,
            startDate: toDateInput(editingManual.startDate),
            endDate: toDateInput(editingManual.endDate),
            isActive: editingManual.isActive,
          }}
          onClose={() => setModal("closed")}
        />
      )}
      {editingAuto && (
        <AutoDiscountModal
          categories={categories}
          products={products}
          discount={{
            id: editingAuto.id,
            name: editingAuto.name,
            percent: editingAuto.percent ?? 0,
            scope: editingAuto.scope ?? "ALL_MENU",
            categoryIds: editingAuto.categoryIds,
            productId: editingAuto.productId,
            description: editingAuto.description,
            startDate: toDateInput(editingAuto.startDate),
            endDate: toDateInput(editingAuto.endDate),
            isActive: editingAuto.isActive,
          }}
          onClose={() => setModal("closed")}
        />
      )}
    </div>
  );
}
