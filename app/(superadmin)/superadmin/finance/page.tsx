import { requireSuperAdmin } from "@/features/auth/services/authorize";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
import { getFinanceStats, getTransactions, getGatewaySettings } from "@/features/superadmin/services/finance-service";
import { Topbar } from "@/components/superadmin/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { FinanceView } from "@/components/superadmin/finance-view";

export default async function SuperAdminFinancePage() {
  const { session } = await requireSuperAdmin();
  const [agent, stats, transactions, gateway] = await Promise.all([
    findUserByPhone(session.phone),
    getFinanceStats(),
    getTransactions(),
    getGatewaySettings(),
  ]);

  return (
    <>
      <Topbar title="مالی" agentName={agent?.fullName ?? "سوپرادمین"} />
      <PanelContent>
        <FinanceView
          stats={stats}
          transactions={transactions}
          gatewaySettings={{
            gatewayEnabled: gateway.gatewayEnabled,
            zarinpalConnected: gateway.zarinpalConnected,
            zarinpalMerchantId: gateway.zarinpalMerchantId,
            zarinpalCallbackUrl: gateway.zarinpalCallbackUrl,
            zarinpalSandbox: gateway.zarinpalSandbox,
            hasApiKey: Boolean(gateway.zarinpalApiKey),
          }}
        />
      </PanelContent>
    </>
  );
}
