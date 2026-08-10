"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/dashboard/primary-button";
import { TeamUserRow, type TeamUserData } from "@/components/superadmin/team-user-row";
import { TeamUserModal } from "@/components/superadmin/team-user-modal";

const PLATFORM_PERMISSIONS = [
  { title: "مالی و تراکنش‌ها", sub: "مشاهده درآمد، تراکنش و درگاه", roles: "مدیر کل · مالی" },
  { title: "مشتریان و اشتراک", sub: "ویرایش پلن، تمدید و تعلیق پنل", roles: "مدیر کل" },
  { title: "تیکت‌ها", sub: "پاسخ‌گویی و ایجاد تیکت", roles: "مدیر کل · پشتیبانی" },
  { title: "کاربران تیم", sub: "دعوت و تغییر سطح دسترسی", roles: "مالک محصول" },
] as const;

export function TeamView({ users }: { users: TeamUserData[] }) {
  const [modal, setModal] = useState<"closed" | "create" | string>("closed");
  const editing = modal !== "closed" && modal !== "create" ? users.find((u) => u.id === modal) : null;
  const activeCount = users.filter((u) => u.isActive).length;

  return (
    <div className="grid grid-cols-1 items-start gap-[22px] lg:grid-cols-[1.85fr_1fr]">
      <div className="flex flex-col gap-[18px] rounded-[22px] bg-card p-[24px_26px_14px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="text-right">
            <div className="text-[17px] font-semibold">کاربران تیم</div>
            <div className="mt-1 text-xs font-light text-text-3">
              دسترسی اعضای تیم داخلی ماگ‌منو ({users.length.toLocaleString("fa-IR")} کاربر ·{" "}
              {activeCount.toLocaleString("fa-IR")} فعال)
            </div>
          </div>
          <PrimaryButton onClick={() => setModal("create")}>دعوت کاربر</PrimaryButton>
        </div>
        <div className="flex flex-col">
          {users.length === 0 && <div className="p-6 text-center text-sm text-text-3">کاربری ثبت نشده است.</div>}
          {users.map((u, i) => (
            <TeamUserRow key={u.id} user={u} isFirst={i === 0} onEdit={() => setModal(u.id)} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-[22px] bg-card p-[24px_26px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
        <div className="text-right">
          <div className="text-[17px] font-semibold">سطوح دسترسی</div>
          <div className="mt-1 text-xs font-light text-text-3">هر سطح چه بخش‌هایی را می‌بیند</div>
        </div>
        <div className="flex flex-col">
          {PLATFORM_PERMISSIONS.map((p, i) => (
            <div
              key={p.title}
              className="flex items-center justify-between gap-3 py-3.5"
              style={{ borderTop: i > 0 ? "1px solid #F4F4F4" : "none" }}
            >
              <div className="text-right">
                <div className="text-sm font-medium">{p.title}</div>
                <div className="mt-0.5 text-[11px] font-light text-text-3">{p.sub}</div>
              </div>
              <span className="whitespace-nowrap text-xs font-light text-[#777]">{p.roles}</span>
            </div>
          ))}
        </div>
      </div>

      {modal === "create" && <TeamUserModal user={null} onClose={() => setModal("closed")} />}
      {editing && (
        <TeamUserModal
          user={{
            id: editing.id,
            fullName: editing.fullName,
            phone: editing.phone,
            platformRole: editing.platformRole,
            platformTeam: editing.platformTeam,
          }}
          onClose={() => setModal("closed")}
        />
      )}
    </div>
  );
}
