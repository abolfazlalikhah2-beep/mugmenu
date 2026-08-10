import Link from "next/link";
import { Store, Calendar } from "lucide-react";
import type { SubscriptionStatus } from "@/features/superadmin/services/subscription-status";
import type { CustomerSummary } from "@/features/superadmin/services/customer-service";

const STATUS_META: Record<SubscriptionStatus, { label: string; fg: string; bg: string }> = {
  ACTIVE: { label: "اشتراک فعال", fg: "#328C3D", bg: "#E5F0E6" },
  TRIAL: { label: "دوره آزمایشی", fg: "#2563EB", bg: "#EAF1FE" },
  EXPIRING: { label: "رو به انقضا", fg: "#B7791F", bg: "#FCF3E3" },
  EXPIRED: { label: "منقضی", fg: "#C15656", bg: "#FBECEC" },
};

export function SubscriptionBadge({ status }: { status: SubscriptionStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className="inline-flex shrink-0 items-center whitespace-nowrap rounded-[9px] px-3 py-[5px] text-xs font-medium"
      style={{ color: meta.fg, background: meta.bg }}
    >
      {meta.label}
    </span>
  );
}

export function CustomerRow({ customer, index }: { customer: CustomerSummary; index: number }) {
  return (
    <div
      className="grid items-center gap-3 py-4 text-sm sm:px-3.5"
      style={{
        gridTemplateColumns: "2fr 1.3fr 1.2fr 1fr 1fr 110px",
        borderTop: index > 0 ? "1px solid #F4F4F4" : "none",
      }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EAF3EB]">
          <Store size={20} className="text-brand" />
        </div>
        <div className="min-w-0 text-right">
          <div className="truncate font-medium">{customer.store}</div>
          <div className="mt-0.5 truncate text-[11px] font-light text-text-3">{customer.owner}</div>
        </div>
      </div>
      <div className="text-right">
        <div dir="ltr" className="text-right text-[13px]">
          {customer.phone}
        </div>
        {customer.address && (
          <div className="mt-0.5 truncate text-[11px] font-light text-text-3">{customer.address}</div>
        )}
      </div>
      <span className="text-[13px] font-light text-[#777]">{customer.planName}</span>
      <div className="flex items-center gap-1.5 text-text-3">
        <Calendar size={15} className="text-[#9A9A9A]" />
        <span className="text-xs font-light">{customer.planExpiresAt.toLocaleDateString("fa-IR")}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <SubscriptionBadge status={customer.status} />
        {customer.isSuspended && (
          <span className="whitespace-nowrap rounded-[9px] bg-[#FBECEC] px-2.5 py-[5px] text-[11px] font-medium text-[#C15656]">
            تعلیق
          </span>
        )}
      </div>
      <div className="flex justify-end">
        <Link
          href={`/superadmin/customers/${customer.id}`}
          className="flex h-[38px] items-center rounded-xl border border-[#E4E4E4] bg-card px-[18px] text-[13px] text-[#5F5F5F]"
        >
          جزئیات
        </Link>
      </div>
    </div>
  );
}
