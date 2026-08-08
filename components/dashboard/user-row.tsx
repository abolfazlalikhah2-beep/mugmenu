"use client";

import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

export type StaffRole = "OWNER" | "MENU_MANAGER" | "CASHIER";

export const ROLE_LABEL: Record<StaffRole, string> = {
  OWNER: "مدیر کل",
  MENU_MANAGER: "مدیر منو",
  CASHIER: "صندوق",
};

const ROLE_ACCESS: Record<StaffRole, string> = {
  OWNER: "دسترسی کامل",
  MENU_MANAGER: "محصولات و دسته‌ها",
  CASHIER: "سفارشات و پرداخت",
};

const ROLE_COLOR: Record<StaffRole, [string, string]> = {
  OWNER: ["#328C3D", "#E5F0E6"],
  MENU_MANAGER: ["#2563EB", "#EAF1FE"],
  CASHIER: ["#B7791F", "#FCF3E3"],
};

export interface StaffUserData {
  id: string;
  fullName: string;
  phone: string;
  role: StaffRole;
}

export function UserRow({
  user,
  isFirst,
  onEdit,
}: {
  user: StaffUserData;
  isFirst: boolean;
  onEdit: () => void;
}) {
  const [fg, bg] = ROLE_COLOR[user.role];

  return (
    <div
      className={cn(
        "flex items-center gap-3 py-3.5 sm:gap-4 sm:px-3.5 sm:py-4",
        !isFirst && "border-t border-[#F4F4F4]"
      )}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E5F0E6] text-base font-semibold text-brand sm:h-12 sm:w-12">
        {user.fullName.slice(0, 1)}
      </div>
      <div className="min-w-0 flex-1 text-right">
        <div className="truncate text-sm font-medium sm:text-[15px]">{user.fullName}</div>
        <div dir="ltr" className="mt-0.5 text-right text-xs font-light text-text-3">
          {user.phone}
        </div>
      </div>
      <span className="hidden w-[150px] shrink-0 text-right text-[13px] font-light text-text-3 sm:block">
        {ROLE_ACCESS[user.role]}
      </span>
      <span
        className="shrink-0 whitespace-nowrap rounded-[9px] px-3 py-[5px] text-xs font-medium"
        style={{ color: fg, background: bg }}
      >
        {ROLE_LABEL[user.role]}
      </span>
      <button
        type="button"
        onClick={onEdit}
        aria-label={`ویرایش ${user.fullName}`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#F4F5F4]"
      >
        <Pencil size={18} className="text-[#5A5A5A]" />
      </button>
    </div>
  );
}
