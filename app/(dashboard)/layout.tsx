import type { ReactNode } from "react";
import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getBusinessFeatureSet } from "@/features/plans/services/plan-service";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { businessId } = await requireBusinessOwner();
  const featureSet = await getBusinessFeatureSet(businessId);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F5F4]">
      <Sidebar featureKeys={featureSet ? [...featureSet.keys] : []} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
