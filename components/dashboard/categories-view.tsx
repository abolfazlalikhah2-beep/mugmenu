"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PrimaryButton } from "@/components/dashboard/primary-button";
import { CategoryRow, type CategoryRowData } from "@/components/dashboard/category-row";
import { CategoryModal } from "@/components/dashboard/category-modal";

export function CategoriesView({
  categories,
}: {
  categories: (CategoryRowData & {
    icon: string | null;
    imageUrl: string | null;
    scheduleEnabled: boolean;
    scheduleDays: number[];
    scheduleStart: string | null;
    scheduleEnd: string | null;
  })[];
}) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"closed" | "create" | string>("closed");

  const filtered = useMemo(
    () => categories.filter((c) => c.name.toLowerCase().includes(search.trim().toLowerCase())),
    [categories, search]
  );

  const editing = modal !== "closed" && modal !== "create" ? categories.find((c) => c.id === modal) : null;

  return (
    <div className="flex h-full flex-col gap-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-[15px] font-light text-[#777]">ترتیب دسته‌ها را با فلش‌ها تغییر دهید</span>
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
              placeholder="جستجوی دسته…"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-[#B0B0B0]"
            />
          </div>
          <PrimaryButton onClick={() => setModal("create")}>دسته جدید</PrimaryButton>
        </div>
      </div>

      <div className="rounded-[22px] bg-card p-[8px_6px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
        <div className="grid grid-cols-[40px_2fr_1.2fr_1fr_1.1fr] gap-2 p-[12px_18px] text-[13px] font-light text-[#A0A0A0]">
          <span />
          <span className="text-right">دسته‌بندی</span>
          <span className="text-right">تعداد</span>
          <span className="text-right">وضعیت</span>
          <span />
        </div>
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-sm text-text-3">دسته‌ای یافت نشد.</div>
        ) : (
          filtered.map((c) => {
            const globalIndex = categories.findIndex((full) => full.id === c.id);
            return (
              <CategoryRow
                key={c.id}
                category={c}
                isFirst={globalIndex === 0}
                isLast={globalIndex === categories.length - 1}
                onEdit={() => setModal(c.id)}
              />
            );
          })
        )}
      </div>

      {modal === "create" && <CategoryModal category={null} onClose={() => setModal("closed")} />}
      {editing && (
        <CategoryModal
          category={{
            id: editing.id,
            name: editing.name,
            icon: editing.icon,
            imageUrl: editing.imageUrl,
            isActive: editing.isActive,
            scheduleEnabled: editing.scheduleEnabled,
            scheduleDays: editing.scheduleDays,
            scheduleStart: editing.scheduleStart,
            scheduleEnd: editing.scheduleEnd,
          }}
          onClose={() => setModal("closed")}
        />
      )}
    </div>
  );
}
