"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "@/features/dashboard/client/sidebar-context";

/** Mobile-only nav toggle — the sidebar itself is off-canvas below md, this is how it's opened. */
export function SidebarHamburgerButton() {
  const { toggle } = useSidebar();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="باز و بسته کردن منو"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4F5F4] text-[#5A5A5A] md:hidden"
    >
      <Menu size={20} />
    </button>
  );
}
