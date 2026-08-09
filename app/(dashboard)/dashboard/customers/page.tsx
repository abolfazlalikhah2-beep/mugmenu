import { Search } from "lucide-react";
import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { getCustomers } from "@/features/dashboard/services/customer-service";
import { Topbar } from "@/components/dashboard/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { CustomersTable } from "@/components/dashboard/customers-table";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const { businessId } = await requireBusinessOwner();
  const business = await getBusiness(businessId);
  if (!business) return null;

  const customers = await getCustomers(businessId, q?.trim() || undefined);

  return (
    <>
      <Topbar title="مشتریان" businessName={business.name} isAcceptingOrders={business.isAcceptingOrders} />
      <PanelContent className="flex flex-col gap-[18px] sm:gap-[22px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-right">
            <div className="text-[15px] font-semibold sm:text-base">مشتریان</div>
            <div className="mt-0.5 text-xs font-light text-text-3">
              {customers.length.toLocaleString("fa-IR")} مشتری ثبت‌شده
            </div>
          </div>
          <form className="flex h-[42px] w-full items-center gap-2.5 rounded-[13px] bg-card px-4 shadow-[0px_4px_12px_rgba(0,0,0,0.03)] sm:w-[300px]">
            <Search size={18} className="text-[#B0B0B0]" />
            <input
              type="text"
              name="q"
              defaultValue={q ?? ""}
              placeholder="جستجوی نام یا شماره…"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-[#B0B0B0]"
            />
          </form>
        </div>
        <CustomersTable customers={customers} />
      </PanelContent>
    </>
  );
}
