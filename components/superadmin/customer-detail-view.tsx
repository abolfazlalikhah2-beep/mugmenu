import { Store } from "lucide-react";
import { SubscriptionBadge } from "@/components/superadmin/customer-row";
import { PaymentHistoryRow } from "@/components/superadmin/payment-history-row";
import { CustomerDetailActions } from "@/components/superadmin/customer-detail-actions";
import { computePlanStatus } from "@/features/dashboard/services/plan-status";
import type { CustomerDetail } from "@/features/superadmin/services/customer-service";
import { getMenuUrl } from "@/lib/menu-url";

function InfoItem({ label, value, ltr, href }: { label: string; value: string; ltr?: boolean; href?: string }) {
  return (
    <div className="flex flex-col gap-1.5 text-right">
      <span className="text-xs font-light text-text-3">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          dir={ltr ? "ltr" : undefined}
          className="text-right text-sm font-medium text-brand underline-offset-2 hover:underline"
        >
          {value}
        </a>
      ) : (
        <span dir={ltr ? "ltr" : undefined} className="text-right text-sm font-medium">
          {value}
        </span>
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[13px]">
      <span className="font-light text-text-3">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

const BILLING_CYCLE_LABEL: Record<string, string> = {
  MONTHLY: "مبلغ ماهانه",
  SIX_MONTH: "مبلغ ۶ ماهه",
  ANNUAL: "مبلغ سالانه",
};

export function CustomerDetailView({
  detail,
  plans,
}: {
  detail: CustomerDetail;
  plans: { id: string; key: string; name: string; monthlyPrice: number; sixMonthPrice: number; annualPrice: number }[];
}) {
  const { business, owner, status, demoActive, activity, payments } = detail;
  const planStatus = computePlanStatus(business.planStartedAt, business.planExpiresAt);
  const currentPrice =
    business.billingCycle === "ANNUAL"
      ? business.plan.annualPrice
      : business.billingCycle === "SIX_MONTH"
        ? business.plan.sixMonthPrice
        : business.plan.monthlyPrice;

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[22px] bg-card p-[22px_28px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3.5">
          <div className="flex h-[54px] w-[54px] items-center justify-center rounded-2xl bg-[#EAF3EB]">
            <Store size={24} className="text-brand" />
          </div>
          <div className="text-right">
            <div className="text-xl font-semibold">{business.name}</div>
            <div className="mt-1 text-[13px] font-light text-text-3">
              {owner?.fullName ?? "—"}
              {business.address ? ` · ${business.address}` : ""}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <SubscriptionBadge status={status} />
          {business.isSuspended && (
            <span className="whitespace-nowrap rounded-[9px] bg-[#FBECEC] px-3 py-[5px] text-xs font-medium text-[#C15656]">
              تعلیق
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[18px] rounded-[18px] border border-[#EFEFEF] bg-card p-[20px_22px] sm:grid-cols-3">
        <InfoItem label="صاحب امتیاز" value={owner?.fullName ?? "—"} />
        <InfoItem label="شماره تماس" value={business.phone ?? "—"} ltr />
        <InfoItem label="آدرس" value={business.address ?? "—"} />
        <InfoItem
          label="تاریخ عضویت"
          value={business.createdAt.toLocaleDateString("fa-IR", { day: "2-digit", month: "long", year: "numeric" })}
        />
        <InfoItem
          label="شناسه پنل"
          value={business.slug}
          ltr
          href={getMenuUrl({ slug: business.slug, planKey: business.plan.key, customDomain: business.customDomain })}
        />
        <InfoItem label="آخرین ورود" value={owner?.lastLoginAt?.toLocaleString("fa-IR", { dateStyle: "short", timeStyle: "short" }) ?? "—"} />
      </div>

      <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-[18px] border border-[#EFEFEF] bg-card p-[18px_20px]">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-semibold">وضعیت اشتراک</span>
            <SubscriptionBadge status={status} />
          </div>
          <SummaryRow label="پلن فعلی" value={business.plan.name} />
          <SummaryRow label="تاریخ تمدید" value={business.planExpiresAt.toLocaleDateString("fa-IR")} />
          <SummaryRow
            label={BILLING_CYCLE_LABEL[business.billingCycle] ?? "مبلغ"}
            value={`${currentPrice.toLocaleString("fa-IR")} تومان`}
          />
          <div className="mt-1 h-2 overflow-hidden rounded-md bg-[#F0F0F0]">
            <div className="h-full bg-brand" style={{ width: `${planStatus.progressPercent}%` }} />
          </div>
          <span className="text-[11px] font-light text-text-3">
            {planStatus.isExpired ? "دوره به پایان رسیده" : `${planStatus.daysRemaining.toLocaleString("fa-IR")} روز تا پایان دوره`}
          </span>
        </div>

        <div className="flex flex-col gap-3 rounded-[18px] border border-[#EFEFEF] bg-card p-[18px_20px]">
          <span className="text-[15px] font-semibold">خلاصه فعالیت</span>
          <SummaryRow label="تعداد محصولات" value={`${activity.productCount.toLocaleString("fa-IR")} آیتم`} />
          <SummaryRow label="سفارش ماه جاری" value={`${activity.ordersThisMonth.toLocaleString("fa-IR")} سفارش`} />
          <SummaryRow
            label="آخرین ورود"
            value={owner?.lastLoginAt?.toLocaleString("fa-IR", { dateStyle: "short", timeStyle: "short" }) ?? "—"}
          />
          <SummaryRow label="تیکت باز" value={`${activity.openTicketCount.toLocaleString("fa-IR")} مورد`} />
        </div>
      </div>

      <div className="overflow-hidden rounded-[18px] border border-[#EFEFEF] bg-card">
        <div className="flex items-center justify-between p-[16px_20px_12px]">
          <span className="text-[15px] font-semibold">تاریخچه پرداخت</span>
          <span className="text-xs font-light text-text-3">{payments.length.toLocaleString("fa-IR")} پرداخت اخیر</span>
        </div>
        {payments.length === 0 ? (
          <div className="p-6 text-center text-sm text-text-3">هنوز پرداختی ثبت نشده است.</div>
        ) : (
          payments.map((p, i) => <PaymentHistoryRow key={p.id} payment={p} index={i} />)
        )}
      </div>

      <CustomerDetailActions
        businessId={business.id}
        storeName={business.name}
        isSuspended={business.isSuspended}
        plans={plans}
        currentPlanId={business.planId}
        currentBillingCycle={business.billingCycle}
        isDemoActive={business.isDemoActive}
        demoActiveNow={demoActive}
        demoExpiresAt={business.demoExpiresAt}
      />
    </div>
  );
}
