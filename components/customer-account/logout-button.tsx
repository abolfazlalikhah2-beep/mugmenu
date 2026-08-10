"use client";

import { LogOut } from "lucide-react";
import { customerLogoutAction } from "@/features/customer/routes/actions";

export function LogoutButton({ slug }: { slug: string }) {
  return (
    <button
      type="button"
      onClick={() => customerLogoutAction(slug)}
      className="flex items-center justify-center gap-2 py-2.5 text-[#C15656]"
    >
      <LogOut size={18} />
      <span className="text-sm">خروج از حساب</span>
    </button>
  );
}
