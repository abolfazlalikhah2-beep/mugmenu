import { StatusBadge } from "@/components/ui/status-badge";

export function AcceptingOrdersLine({ isAcceptingOrders }: { isAcceptingOrders: boolean }) {
  return (
    <StatusBadge
      status={isAcceptingOrders ? "online" : "offline"}
      label={isAcceptingOrders ? "سفارش میپذیریم" : "فعلاً بسته است"}
    />
  );
}
