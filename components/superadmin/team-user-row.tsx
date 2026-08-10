"use client";

import { Pencil } from "lucide-react";
import { ServerToggle } from "@/components/dashboard/server-toggle";
import { toggleTeamMemberActiveAction } from "@/features/superadmin/routes/actions";
import type { PlatformRole } from "@/lib/generated/prisma/enums";
import { cn } from "@/lib/utils";

export const PLATFORM_ROLE_LABEL: Record<PlatformRole, string> = {
  OWNER: "مالک محصول",
  ADMIN: "مدیر کل",
  SUPPORT: "پشتیبانی",
  FINANCE: "مالی",
  VIEWER: "فقط مشاهده",
};

const ROLE_COLOR: Record<PlatformRole, [string, string]> = {
  OWNER: ["#328C3D", "#E5F0E6"],
  ADMIN: ["#2563EB", "#EAF1FE"],
  SUPPORT: ["#B7791F", "#FCF3E3"],
  FINANCE: ["#6D28D9", "#F1EBFD"],
  VIEWER: ["#8A8A8A", "#F0F0F0"],
};

export function PlatformRoleBadge({ role }: { role: PlatformRole }) {
  const [fg, bg] = ROLE_COLOR[role];
  return (
    <span
      className="inline-flex shrink-0 items-center whitespace-nowrap rounded-[9px] px-3 py-[5px] text-xs font-medium"
      style={{ color: fg, background: bg }}
    >
      {PLATFORM_ROLE_LABEL[role]}
    </span>
  );
}

export interface TeamUserData {
  id: string;
  fullName: string;
  phone: string;
  platformRole: PlatformRole;
  platformTeam: string | null;
  lastLoginAt: Date | null;
  isActive: boolean;
}

export function TeamUserRow({
  user,
  isFirst,
  onEdit,
}: {
  user: TeamUserData;
  isFirst: boolean;
  onEdit: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 py-3.5 sm:gap-4 sm:px-3.5 sm:py-4",
        !isFirst && "border-t border-[#F4F4F4]",
        !user.isActive && "opacity-60"
      )}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F4F5F4] text-base font-semibold text-[#7A7A7A]">
        {user.fullName.slice(0, 1)}
      </div>
      <div className="min-w-0 flex-1 text-right">
        <div className="truncate text-sm font-medium sm:text-[15px]">{user.fullName}</div>
        <div dir="ltr" className="mt-0.5 text-right text-xs font-light text-text-3">
          {user.phone}
        </div>
      </div>
      <span className="hidden w-[130px] shrink-0 text-right text-[13px] font-light text-text-3 sm:block">
        {user.platformTeam ?? "—"}
      </span>
      <span className="hidden w-[150px] shrink-0 text-right text-xs font-light text-text-3 sm:block">
        {user.lastLoginAt?.toLocaleString("fa-IR", { dateStyle: "short", timeStyle: "short" }) ?? "هنوز وارد نشده"}
      </span>
      <PlatformRoleBadge role={user.platformRole} />
      <button
        type="button"
        onClick={onEdit}
        aria-label={`ویرایش ${user.fullName}`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#F4F5F4]"
      >
        <Pencil size={18} className="text-[#5A5A5A]" />
      </button>
      <ServerToggle initial={user.isActive} action={(next) => toggleTeamMemberActiveAction(user.id, next)} />
    </div>
  );
}
