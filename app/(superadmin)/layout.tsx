import type { ReactNode } from "react";
import { requireSuperAdmin } from "@/features/auth/services/authorize";
import { Sidebar } from "@/components/superadmin/sidebar";

export default async function SuperAdminLayout({ children }: { children: ReactNode }) {
  await requireSuperAdmin();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F5F4]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
