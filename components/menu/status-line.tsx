import { StatusBadge } from "@/components/ui/status-badge";
import { menuCopy, type MenuLang } from "@/features/menu/utils/menu-language";

export function AcceptingOrdersLine({
  isAcceptingOrders,
  lang = "fa",
}: {
  isAcceptingOrders: boolean;
  lang?: MenuLang;
}) {
  const t = menuCopy(lang);
  return (
    <StatusBadge
      status={isAcceptingOrders ? "online" : "offline"}
      label={isAcceptingOrders ? t.acceptingOrders : t.closed}
    />
  );
}
