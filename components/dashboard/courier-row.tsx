"use client";

import { useTransition } from "react";
import { Phone, Pencil, Trash2 } from "lucide-react";
import { Toggle } from "@/components/dashboard/toggle";
import { toggleCourierActiveAction, deleteCourierAction } from "@/features/dashboard/routes/actions";

export interface CourierRowData {
  id: string;
  name: string;
  phone: string;
  vehicleType: "MOTORCYCLE" | "CAR";
  isActive: boolean;
  busyCount: number;
  todayCount: number;
}

const VEHICLE_LABEL: Record<CourierRowData["vehicleType"], string> = {
  MOTORCYCLE: "موتور",
  CAR: "خودرو",
};

function StatusBadge({ courier }: { courier: CourierRowData }) {
  if (!courier.isActive) {
    return (
      <span className="inline-block rounded-[20px] px-2.5 py-1 text-[11.5px] font-medium text-[#8A8A8A]" style={{ background: "#F1F1F1" }}>
        غیرفعال
      </span>
    );
  }
  if (courier.busyCount > 0) {
    return (
      <span className="inline-block rounded-[20px] px-2.5 py-1 text-[11.5px] font-medium text-[#9F7A2B]" style={{ background: "#FDF7E6" }}>
        در مسیر · {courier.busyCount.toLocaleString("fa-IR")} سفارش
      </span>
    );
  }
  return (
    <span className="inline-block rounded-[20px] bg-[#E5F0E6] px-2.5 py-1 text-[11.5px] font-medium text-brand">
      آزاد
    </span>
  );
}

export function CourierRow({ courier, onEdit }: { courier: CourierRowData; onEdit: () => void }) {
  const [pending, startTransition] = useTransition();

  function handleToggle(next: boolean) {
    startTransition(async () => {
      await toggleCourierActiveAction(courier.id, next);
    });
  }

  function handleDelete() {
    if (!confirm(`«${courier.name}» حذف شود؟`)) return;
    startTransition(async () => {
      await deleteCourierAction(courier.id);
    });
  }

  return (
    <div
      className="grid grid-cols-[1.5fr_1.1fr_0.8fr_1.2fr_0.8fr_0.9fr] items-center gap-3 border-t border-[#F4F4F4] p-[15px_18px] text-sm first:border-t-0"
      style={{ opacity: courier.isActive ? 1 : 0.68 }}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <div
          className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-2xl text-[14px] font-semibold"
          style={{ background: courier.isActive ? "#E5F0E6" : "#F1F1F1", color: courier.isActive ? "#328C3D" : "#9F9F9F" }}
        >
          {courier.name.slice(0, 1)}
        </div>
        <span className="truncate font-medium">{courier.name}</span>
      </div>
      <div className="flex items-center gap-1.5 text-[13px] text-[#5F5F5F]">
        <Phone size={15} className="text-[#B0B0B0]" />
        <span dir="ltr">{courier.phone}</span>
      </div>
      <span className="text-[13px] text-[#5F5F5F]">{VEHICLE_LABEL[courier.vehicleType]}</span>
      <div>
        <StatusBadge courier={courier} />
      </div>
      <span className="font-mont text-[13.5px] text-[#5F5F5F]">{courier.todayCount.toLocaleString("fa-IR")} سفارش</span>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onEdit}
          aria-label={`ویرایش ${courier.name}`}
          className="flex h-[34px] w-[34px] items-center justify-center rounded-[11px] bg-[#F4F5F4]"
        >
          <Pencil size={17} className="text-[#5A5A5A]" />
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          aria-label={`حذف ${courier.name}`}
          className="flex h-[34px] w-[34px] items-center justify-center rounded-[11px] bg-[#FBECEC] disabled:opacity-60"
        >
          <Trash2 size={17} className="text-[#D06666]" />
        </button>
        <Toggle checked={courier.isActive} onChange={handleToggle} disabled={pending} />
      </div>
    </div>
  );
}
