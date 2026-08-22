import { requireSuperAdmin } from "@/features/auth/services/authorize";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
import { getPaymentCards } from "@/features/payments/services/payment-service";
import { Topbar } from "@/components/superadmin/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { PaymentCardsView } from "@/components/superadmin/payment-cards-view";

export default async function SuperAdminPaymentCardsPage() {
  const { session } = await requireSuperAdmin();
  const [agent, cards] = await Promise.all([findUserByPhone(session.phone), getPaymentCards()]);

  return (
    <>
      <Topbar title="تنظیمات پرداخت" agentName={agent?.fullName ?? "سوپرادمین"} />
      <PanelContent>
        <PaymentCardsView cards={cards} />
      </PanelContent>
    </>
  );
}
