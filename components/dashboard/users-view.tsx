"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/dashboard/primary-button";
import { UserRow, type StaffUserData } from "@/components/dashboard/user-row";
import { UserModal } from "@/components/dashboard/user-modal";

export function UsersView({ users, maxUsers }: { users: StaffUserData[]; maxUsers: number }) {
  const [modal, setModal] = useState<"closed" | "create" | string>("closed");
  const editing = modal !== "closed" && modal !== "create" ? users.find((u) => u.id === modal) : null;
  const atLimit = users.length >= maxUsers;

  return (
    <div className="flex h-full flex-col gap-[18px] sm:gap-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-right">
          <div className="text-[15px] font-semibold sm:text-base">کاربران ادمین</div>
          <div className="mt-0.5 text-xs font-light text-text-3">
            اعضای تیم با دسترسی به پنل مدیریت ({users.length.toLocaleString("fa-IR")} از{" "}
            {maxUsers.toLocaleString("fa-IR")} کاربر مجاز)
          </div>
        </div>
        <PrimaryButton
          onClick={() => setModal("create")}
          disabled={atLimit}
          title={atLimit ? "سقف کاربران این پلن پر شده است" : undefined}
        >
          افزودن کاربر
        </PrimaryButton>
      </div>

      <div className="rounded-[22px] bg-card p-[8px_16px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)] sm:p-[12px_20px]">
        {users.map((u, i) => (
          <UserRow key={u.id} user={u} isFirst={i === 0} onEdit={() => setModal(u.id)} />
        ))}
      </div>

      {modal === "create" && <UserModal user={null} onClose={() => setModal("closed")} />}
      {editing && <UserModal user={editing} onClose={() => setModal("closed")} />}
    </div>
  );
}
