"use client";

import { LogOut } from "lucide-react";
import { customerLogoutAction } from "@/features/customer/routes/actions";
import { menuCopy, type MenuLang } from "@/features/menu/utils/menu-language";

export function LogoutButton({ slug, lang = "fa" }: { slug: string; lang?: MenuLang }) {
  const t = menuCopy(lang);
  return (
    <button
      type="button"
      onClick={() => customerLogoutAction(slug)}
      className="flex items-center justify-center gap-2 py-2.5 text-[#C15656]"
    >
      <LogOut size={18} />
      <span className="text-sm">{t.logout}</span>
    </button>
  );
}
