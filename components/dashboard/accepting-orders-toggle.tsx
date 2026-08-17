"use client";

import { cn } from "@/lib/utils";
import { Toggle } from "@/components/dashboard/toggle";
import { useAcceptingOrders } from "@/features/dashboard/client/accepting-orders-context";

/** The header (Topbar) rendering of the shared accepting-orders switch. */
export function AcceptingOrdersToggle({ className }: { className?: string }) {
  const { isAcceptingOrders, pending, toggle } = useAcceptingOrders();
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm font-light text-[#777]">وضعیت سفارش‌گیری</span>
      <Toggle checked={isAcceptingOrders} disabled={pending} onChange={toggle} />
    </div>
  );
}
