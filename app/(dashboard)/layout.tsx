import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getBusinessFeatureSet } from "@/features/plans/services/plan-service";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { Sidebar } from "@/components/dashboard/sidebar";
import { AcceptingOrdersProvider } from "@/features/dashboard/client/accepting-orders-context";
import { SidebarProvider } from "@/features/dashboard/client/sidebar-context";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { businessId } = await requireBusinessOwner();
  const [featureSet, business] = await Promise.all([
    getBusinessFeatureSet(businessId),
    getBusiness(businessId),
  ]);
  if (!business) notFound();

  return (
    <AcceptingOrdersProvider initial={business.isAcceptingOrders}>
      <SidebarProvider>
        <div className="flex h-screen overflow-hidden bg-[#F4F5F4]">
          <Sidebar featureKeys={featureSet ? [...featureSet.keys] : []} />
          <div className="flex min-w-0 flex-1 flex-col">{children}</div>
        </div>
      </SidebarProvider>
    </AcceptingOrdersProvider>
  );
}
