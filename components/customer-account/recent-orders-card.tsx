import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CustomerOrderRow } from "@/components/customer-account/customer-order-row";
import type { CustomerOrderSummary } from "@/features/customer/services/order-history-service";
import { menuCopy, type MenuLang } from "@/features/menu/utils/menu-language";

export function RecentOrdersCard({
  slug,
  orders,
  lang = "fa",
}: {
  slug: string;
  orders: CustomerOrderSummary[];
  lang?: MenuLang;
}) {
  const t = menuCopy(lang);
  return (
    <div className="rounded-card-sm bg-card p-4.5 shadow-float">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[15px] font-semibold">{t.recentOrdersTitle}</span>
        <Link href={`/${slug}/account/orders`} className="flex items-center gap-1 text-brand">
          <span className="text-[12.5px]">{t.allOrders}</span>
          <ChevronLeft size={16} />
        </Link>
      </div>
      {orders.length === 0 ? (
        <p className="py-6 text-center text-sm text-text-3">{t.noOrdersYet}</p>
      ) : (
        orders
          .slice(0, 3)
          .map((o, i) => <CustomerOrderRow key={o.id} slug={slug} order={o} isFirst={i === 0} lang={lang} />)
      )}
    </div>
  );
}
