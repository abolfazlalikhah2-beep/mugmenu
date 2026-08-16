import Link from "next/link";
import { Search } from "lucide-react";
import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { getOrders } from "@/features/dashboard/services/order-mgmt-service";
import { getProducts } from "@/features/dashboard/services/product-service";
import { businessHasFeature } from "@/features/plans/services/plan-service";
import { Topbar } from "@/components/dashboard/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { OrdersTable } from "@/components/dashboard/orders-table";
import { ManualOrderTrigger } from "@/components/dashboard/manual-order-trigger";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/generated/prisma/enums";

const TABS: { label: string; status?: OrderStatus }[] = [
  { label: "همه" },
  { label: "جدید", status: "NEW" },
  { label: "در حال آماده‌سازی", status: "PREPARING" },
  { label: "آماده تحویل", status: "READY" },
];

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;
  const { businessId } = await requireBusinessOwner();
  const [business, products, hasManualEntry] = await Promise.all([
    getBusiness(businessId),
    getProducts(businessId),
    businessHasFeature(businessId, "order.manual_entry"),
  ]);
  if (!business) return null;

  const activeStatus = TABS.some((t) => t.status === status) ? (status as OrderStatus) : undefined;
  const orders = await getOrders(businessId, { status: activeStatus, search: q?.trim() || undefined });
  const manualOrderProducts = products
    .filter((p) => p.isActive)
    .map((p) => ({ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl }));

  return (
    <>
      <Topbar
        title="سفارشات"
        businessName={business.name}
        isAcceptingOrders={business.isAcceptingOrders}
        action={<ManualOrderTrigger products={manualOrderProducts} allowed={hasManualEntry} />}
      />
      <PanelContent className="flex flex-col gap-[22px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2.5">
            {TABS.map((tab) => {
              const active = tab.status === activeStatus;
              const href = tab.status ? `/dashboard/orders?status=${tab.status}` : "/dashboard/orders";
              return (
                <Link
                  key={tab.label}
                  href={href}
                  className={cn(
                    "flex h-[42px] items-center rounded-[13px] px-[22px] text-sm",
                    active
                      ? "bg-brand font-medium text-white"
                      : "bg-card font-normal text-[#777] shadow-[0px_4px_12px_rgba(0,0,0,0.03)]"
                  )}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
          <form className="flex h-[42px] w-[280px] items-center gap-2.5 rounded-[13px] bg-card px-4 shadow-[0px_4px_12px_rgba(0,0,0,0.03)]">
            {activeStatus && <input type="hidden" name="status" value={activeStatus} />}
            <Search size={18} className="text-[#B0B0B0]" />
            <input
              type="text"
              name="q"
              defaultValue={q ?? ""}
              placeholder="جستجوی سفارش، مشتری…"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-[#B0B0B0]"
            />
          </form>
        </div>
        <OrdersTable
          orders={orders}
          header={
            <div className="flex items-center justify-between p-[0_8px_4px]">
              <span className="text-[17px] font-semibold">آخرین سفارشات</span>
              <span className="text-[13px] text-[#9A9A9A]">{orders.length.toLocaleString("fa-IR")} سفارش</span>
            </div>
          }
        />
      </PanelContent>
    </>
  );
}
