import { Receipt, Users, Wallet } from "lucide-react";
import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getBusiness, getBusinessMenuUrl } from "@/features/dashboard/services/settings-service";
import { getDashboardStats, getBusyHours, getCategorySummary } from "@/features/dashboard/services/stats-service";
import { getRecentOrders } from "@/features/dashboard/services/order-mgmt-service";
import { businessHasFeature } from "@/features/plans/services/plan-service";
import { Topbar } from "@/components/dashboard/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { StatCard } from "@/components/dashboard/stat-card";
import { BusyHoursChart } from "@/components/dashboard/busy-hours-chart";
import { OrdersTable } from "@/components/dashboard/orders-table";
import { ProfileCard } from "@/components/dashboard/profile-card";
import { CategorySummary } from "@/components/dashboard/category-summary";
import { ManualOrderTrigger } from "@/components/dashboard/manual-order-trigger";
import { formatToman } from "@/features/menu/utils/money";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function DashboardHomePage() {
  const { businessId } = await requireBusinessOwner();
  const business = await getBusiness(businessId);
  if (!business) notFound();

  const [stats, busyHours, recentOrders, categorySummary, hasManualEntry, menuUrl] = await Promise.all([
    getDashboardStats(businessId),
    getBusyHours(businessId),
    getRecentOrders(businessId, 5),
    getCategorySummary(businessId),
    businessHasFeature(businessId, "order.manual_entry"),
    getBusinessMenuUrl(businessId),
  ]);

  return (
    <>
      <Topbar
        title="داشبورد"
        businessName={business.name}
        action={
          <ManualOrderTrigger
            allowed={hasManualEntry}
            acceptsDineIn={business.acceptsDineIn}
            acceptsTakeaway={business.acceptsTakeaway}
            acceptsDelivery={business.acceptsDelivery}
            label="ثبت سفارش سریع"
            className="h-[46px] px-[22px] text-[15px] shadow-[0px_8px_17.5px_rgba(50,140,61,0.22)]"
          />
        }
      />
      <PanelContent>
        <div className="grid h-full items-start gap-[22px] lg:grid-cols-[2.1fr_1fr]">
          <div className="flex min-w-0 flex-col gap-[22px]">
            <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-3">
              <StatCard
                label="سفارش امروز"
                value={stats.orders.value.toLocaleString("fa-IR")}
                deltaPercent={stats.orders.deltaPercent}
                up={stats.orders.up}
                icon={<Receipt size={20} className="text-brand" />}
              />
              <StatCard
                label="مشتری امروز"
                value={stats.customers.value.toLocaleString("fa-IR")}
                deltaPercent={stats.customers.deltaPercent}
                up={stats.customers.up}
                icon={<Users size={20} className="text-brand" />}
              />
              <StatCard
                label="درآمد امروز"
                value={`${formatToman(stats.revenue.value)} ت`}
                deltaPercent={stats.revenue.deltaPercent}
                up={stats.revenue.up}
                icon={<Wallet size={20} className="text-brand" />}
              />
            </div>
            <BusyHoursChart hours={busyHours} />
            <OrdersTable
              orders={recentOrders}
              header={
                <div className="flex items-center justify-between p-[0_8px_4px]">
                  <span className="text-[17px] font-semibold">۵ سفارش آخر</span>
                  <Link href="/dashboard/orders" className="text-[13px] text-brand">
                    مشاهده همه
                  </Link>
                </div>
              }
            />
          </div>
          <div className="flex min-w-0 flex-col gap-[22px]">
            <ProfileCard name={business.name} slug={business.slug} address={business.address} menuUrl={menuUrl ?? `/${business.slug}`} />
            <CategorySummary
              totalSales={categorySummary.totalSales}
              topProducts={categorySummary.topProducts}
              categories={categorySummary.categories}
            />
          </div>
        </div>
      </PanelContent>
    </>
  );
}
