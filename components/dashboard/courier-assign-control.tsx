"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bike, ChevronDown, Check, Plus } from "lucide-react";
import { assignCourierAction } from "@/features/dashboard/routes/actions";

export interface AssignableCourier {
  id: string;
  name: string;
  vehicleType: "MOTORCYCLE" | "CAR";
  busyCount: number;
}

const VEHICLE_LABEL: Record<AssignableCourier["vehicleType"], string> = {
  MOTORCYCLE: "موتور",
  CAR: "خودرو",
};

export function CourierAssignControl({
  orderId,
  currentCourier,
  couriers,
}: {
  orderId: string;
  currentCourier: { id: string; name: string } | null;
  couriers: AssignableCourier[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);

  function handlePick(courierId: string) {
    const nextId = currentCourier?.id === courierId ? null : courierId;
    setOpen(false);
    startTransition(async () => {
      await assignCourierAction(orderId, nextId);
      router.refresh();
    });
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={pending}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 items-center gap-2 rounded-xl border px-3.5 text-[13px] disabled:opacity-60"
        style={{
          borderColor: currentCourier ? "rgba(50,140,61,0.28)" : "#EAEAEA",
          background: currentCourier ? "rgba(50,140,61,0.06)" : "#fff",
          color: currentCourier ? "#2F6B36" : "#9F9F9F",
        }}
      >
        <Bike size={17} className={currentCourier ? "text-brand" : "text-[#B0B0B0]"} />
        <span className="whitespace-nowrap">{currentCourier?.name ?? "تخصیص پیک"}</span>
        <ChevronDown size={15} className={currentCourier ? "text-brand" : "text-[#B0B0B0]"} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-11 right-0 z-20 w-[270px] rounded-2xl border border-[#F0F0F0] bg-card p-2 shadow-modal">
            <div className="p-[7px_10px_6px] text-[11.5px] text-[#A7A7A7]">انتخاب پیک برای این سفارش</div>
            {couriers.length === 0 && (
              <div className="p-[8px_10px] text-[12.5px] text-text-3">پیک فعالی ثبت نشده است.</div>
            )}
            {couriers.map((c) => {
              const on = c.id === currentCourier?.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handlePick(c.id)}
                  className="flex w-full items-center gap-2.5 rounded-[13px] p-[9px_10px] text-right"
                  style={{ background: on ? "rgba(50,140,61,0.07)" : "transparent" }}
                >
                  <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-2xl bg-[#E5F0E6] text-[13px] font-semibold text-brand">
                    {c.name.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1 text-right">
                    <div className="text-[13.5px] font-medium">{c.name}</div>
                    <div className="mt-0.5 text-[11px] text-[#9F9F9F]">
                      {c.busyCount > 0 ? `در مسیر · ${c.busyCount.toLocaleString("fa-IR")} سفارش` : `آزاد · ${VEHICLE_LABEL[c.vehicleType]}`}
                    </div>
                  </div>
                  {on && <Check size={17} className="text-brand" />}
                </button>
              );
            })}
            <div className="my-1.5 border-t border-[#F2F2F2]" />
            <Link
              href="/dashboard/couriers"
              className="flex items-center gap-2 p-[9px_12px] text-[13px] text-brand"
            >
              <Plus size={15} />
              افزودن پیک جدید
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
