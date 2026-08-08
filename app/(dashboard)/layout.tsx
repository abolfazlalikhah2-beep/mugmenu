import type { ReactNode } from "react";
import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await requireBusinessOwner();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F5F4]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
