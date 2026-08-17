"use client";

import { cn } from "@/lib/utils";
import { Toggle } from "@/components/dashboard/toggle";
import { useAcceptingOrders } from "@/features/dashboard/client/accepting-orders-context";

/** The dashboard-overview (ProfileCard) rendering of the shared accepting-orders switch. */
export function AcceptingOrdersStatus() {
  const { isAcceptingOrders, pending, toggle } = useAcceptingOrders();
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={cn("h-2 w-2 rounded-full", isAcceptingOrders ? "bg-success" : "bg-text-3")} />
        <span className={cn("text-sm font-medium", isAcceptingOrders ? "text-brand" : "text-text-3")}>
          {isAcceptingOrders ? "مجموعه فعال است" : "سفارش‌گیری بسته است"}
        </span>
      </div>
      <Toggle checked={isAcceptingOrders} disabled={pending} onChange={toggle} />
    </div>
  );
}
