import Link from "next/link";
import { Store, ShieldCheck, Sparkles, ShoppingBag, Wallet, UserPlus, Calendar } from "lucide-react";
import { KpiCard } from "@/components/superadmin/kpi-card";
import type { DashboardOverview } from "@/features/superadmin/services/dashboard-service";

export function DashboardView({ overview }: { overview: DashboardOverview }) {
  const {
    totalBusinesses,
    activeBusinesses,
    demoBusinesses,
    businessesByPlan,
    ordersLast30Days,
    revenueLast30Days,
    newBusinessesThisMonth,
    expiringSoon,
  } = overview;

  const maxPlanCount = Math.max(1, ...businessesByPlan.map((p) => p.count));

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <KpiCard
          label="کل کسب‌وکارها"
          value={totalBusinesses.toLocaleString("fa-IR")}
          unit="مجموعه"
          icon={<Store size={20} className="text-brand" />}
        />
        <KpiCard
          label="کسب‌وکارهای فعال"
          value={activeBusinesses.toLocaleString("fa-IR")}
          unit="مجموعه"
          icon={<ShieldCheck size={20} className="text-brand" />}
          note="غیر تعلیق‌شده"
        />
        <KpiCard
          label="در حال دمو"
          value={demoBusinesses.toLocaleString("fa-IR")}
          unit="مجموعه"
          icon={<Sparkles size={20} className="text-brand" />}
          note="دمو آزمایشی فعال"
        />
        <KpiCard
          label="عضو جدید این ماه"
          value={newBusinessesThisMonth.toLocaleString("fa-IR")}
          unit="مجموعه"
          icon={<UserPlus size={20} className="text-brand" />}
        />
        <KpiCard
          label="سفارش‌ها"
          value={ordersLast30Days.toLocaleString("fa-IR")}
          unit="سفارش"
          icon={<ShoppingBag size={20} className="text-brand" />}
          note="۳۰ روز اخیر · همه کسب‌وکارها"
        />
        <KpiCard
          label="درآمد سفارش‌ها"
          value={revenueLast30Days.toLocaleString("fa-IR")}
          unit="تومان"
          icon={<Wallet size={20} className="text-brand" />}
          note="۳۰ روز اخیر · همه کسب‌وکارها"
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-[22px] lg:grid-cols-2">
        <div className="flex flex-col gap-[18px] rounded-[22px] bg-card p-[24px_26px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
          <div className="text-right">
            <div className="text-[17px] font-semibold">کسب‌وکارها به تفکیک پلن</div>
            <div className="mt-1 text-xs font-light text-text-3">تعداد مشترکین هر پلن</div>
          </div>
          <div className="flex flex-col gap-4">
            {businessesByPlan.map((p) => (
              <div key={p.key} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-medium">{p.name}</span>
                  <span className="font-light text-text-3">{p.count.toLocaleString("fa-IR")} مجموعه</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-md bg-[#F0F0F0]">
                  <div
                    className="h-full rounded-md bg-brand"
                    style={{ width: `${(p.count / maxPlanCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[18px] rounded-[22px] bg-card p-[24px_26px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
          <div className="text-right">
            <div className="text-[17px] font-semibold">نزدیک به انقضا</div>
            <div className="mt-1 text-xs font-light text-text-3">اشتراک یا دمو طی ۷ روز آینده پایان می‌یابد</div>
          </div>
          <div className="flex flex-col">
            {expiringSoon.length === 0 && (
              <div className="p-6 text-center text-sm text-text-3">موردی برای هفته آینده وجود ندارد.</div>
            )}
            {expiringSoon.map((b, i) => (
              <div
                key={b.id}
                className="flex items-center justify-between gap-3 py-3.5"
                style={{ borderTop: i > 0 ? "1px solid #F4F4F4" : "none" }}
              >
                <div className="min-w-0 text-right">
                  <div className="truncate text-sm font-medium">{b.name}</div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11px] font-light text-text-3">
                    <Calendar size={13} className="text-[#9A9A9A]" />
                    {b.expiresAt.toLocaleDateString("fa-IR")}
                    <span
                      className="whitespace-nowrap rounded-[7px] px-2 py-[2px] text-[10px] font-medium"
                      style={
                        b.kind === "DEMO"
                          ? { color: "#2563EB", background: "#EAF1FE" }
                          : { color: "#B7791F", background: "#FCF3E3" }
                      }
                    >
                      {b.kind === "DEMO" ? "دمو" : "اشتراک"}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/superadmin/customers/${b.id}`}
                  className="flex h-9 shrink-0 items-center rounded-xl border border-[#E4E4E4] bg-card px-3.5 text-xs text-[#5F5F5F]"
                >
                  مشاهده
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
