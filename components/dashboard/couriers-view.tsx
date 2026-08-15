"use client";

import { useMemo, useState } from "react";
import { Search, Bike, Clock, Receipt } from "lucide-react";
import { PrimaryButton } from "@/components/dashboard/primary-button";
import { CourierStatTile } from "@/components/dashboard/courier-stat-tile";
import { CourierRow, type CourierRowData } from "@/components/dashboard/courier-row";
import { CourierModal } from "@/components/dashboard/courier-modal";

export interface CourierViewData extends CourierRowData {
  nationalCode: string | null;
  coverageZones: string[];
}

export function CouriersView({
  couriers,
  summary,
}: {
  couriers: CourierViewData[];
  summary: { activeCouriersCount: number; inTransitCount: number; todayDeliveriesCount: number };
}) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"closed" | "create" | string>("closed");

  const filtered = useMemo(
    () =>
      couriers.filter(
        (c) => c.name.toLowerCase().includes(search.trim().toLowerCase()) || c.phone.includes(search.trim())
      ),
    [couriers, search]
  );

  const editing = modal !== "closed" && modal !== "create" ? couriers.find((c) => c.id === modal) : null;

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex flex-wrap gap-4">
        <CourierStatTile icon={<Bike size={22} className="text-brand" />} label="پیک فعال" value={summary.activeCouriersCount.toLocaleString("fa-IR")} />
        <CourierStatTile icon={<Clock size={20} className="text-brand" />} label="در حال ارسال" value={summary.inTransitCount.toLocaleString("fa-IR")} />
        <CourierStatTile icon={<Receipt size={20} className="text-brand" />} label="ارسال امروز" value={summary.todayDeliveriesCount.toLocaleString("fa-IR")} />
      </div>

      <div className="rounded-[22px] bg-card p-[24px_26px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
        <div className="mb-[18px] flex flex-wrap items-start justify-between gap-3.5">
          <div className="text-right">
            <div className="text-[17px] font-semibold">پیک‌های داخلی</div>
            <div className="mt-1 text-xs font-light text-text-3">
              {couriers.length.toLocaleString("fa-IR")} پیک ثبت‌شده
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2.5 rounded-[13px] bg-[#FAFBFA] px-4"
              style={{ height: 44, width: 260, boxShadow: "0px 4px 12px rgba(0,0,0,0.03)" }}
            >
              <Search size={18} className="text-[#B0B0B0]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جست‌وجوی پیک…"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-[#B0B0B0]"
              />
            </div>
            <PrimaryButton onClick={() => setModal("create")}>پیک جدید</PrimaryButton>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#F0F0F0]">
          <div className="grid grid-cols-[1.5fr_1.1fr_0.8fr_1.2fr_0.8fr_0.9fr] gap-3 bg-[#FAFBFA] p-[11px_18px] text-xs font-light text-[#A0A0A0]">
            {["پیک", "شماره تماس", "وسیله", "وضعیت", "امروز", "عملیات"].map((h, i) => (
              <span key={h} className={i === 5 ? "text-left" : "text-right"}>
                {h}
              </span>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-sm text-text-3">پیکی یافت نشد.</div>
          ) : (
            filtered.map((c) => <CourierRow key={c.id} courier={c} onEdit={() => setModal(c.id)} />)
          )}
        </div>
      </div>

      {modal === "create" && <CourierModal courier={null} onClose={() => setModal("closed")} />}
      {editing && (
        <CourierModal
          courier={{
            id: editing.id,
            name: editing.name,
            phone: editing.phone,
            vehicleType: editing.vehicleType,
            nationalCode: editing.nationalCode,
            coverageZones: editing.coverageZones,
            isActive: editing.isActive,
          }}
          onClose={() => setModal("closed")}
        />
      )}
    </div>
  );
}
