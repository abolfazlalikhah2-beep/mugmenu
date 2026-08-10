import Link from "next/link";
import { Search } from "lucide-react";
import { CustomerRow } from "@/components/superadmin/customer-row";
import type { CustomerSummary } from "@/features/superadmin/services/customer-service";
import type { SubscriptionStatus } from "@/features/superadmin/services/subscription-status";
import { cn } from "@/lib/utils";

const FILTERS: { label: string; status?: SubscriptionStatus }[] = [
  { label: "همه" },
  { label: "اشتراک فعال", status: "ACTIVE" },
  { label: "دوره آزمایشی", status: "TRIAL" },
  { label: "رو به انقضا", status: "EXPIRING" },
  { label: "منقضی", status: "EXPIRED" },
];

export function CustomersView({
  customers,
  q,
  status,
}: {
  customers: CustomerSummary[];
  q: string;
  status?: SubscriptionStatus;
}) {
  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2.5">
          {FILTERS.map((f) => {
            const active = f.status === status || (!f.status && !status);
            const href = `/superadmin/customers?${new URLSearchParams({
              ...(q ? { q } : {}),
              ...(f.status ? { status: f.status } : {}),
            }).toString()}`;
            return (
              <Link
                key={f.label}
                href={href}
                className={cn(
                  "flex h-10 items-center rounded-xl px-5 text-sm",
                  active
                    ? "bg-brand font-medium text-white"
                    : "bg-card font-normal text-[#777] shadow-[0px_4px_12px_rgba(0,0,0,0.03)]"
                )}
              >
                {f.label}
              </Link>
            );
          })}
        </div>
        <form className="flex h-[42px] w-full items-center gap-2.5 rounded-[13px] bg-card px-4 shadow-[0px_4px_12px_rgba(0,0,0,0.03)] sm:w-[320px]">
          {status && <input type="hidden" name="status" value={status} />}
          <Search size={18} className="text-[#B0B0B0]" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="جستجوی رستوران یا صاحب امتیاز…"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-[#B0B0B0]"
          />
        </form>
      </div>

      <div className="flex flex-col gap-1 rounded-[22px] bg-card p-[8px_16px_14px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
        {customers.length === 0 && (
          <div className="p-6 text-center text-sm text-text-3">مشتری‌ای یافت نشد.</div>
        )}
        {customers.map((c, i) => (
          <CustomerRow key={c.id} customer={c} index={i} />
        ))}
      </div>
    </div>
  );
}
