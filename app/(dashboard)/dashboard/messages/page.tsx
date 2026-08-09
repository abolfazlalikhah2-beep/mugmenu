import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { getContacts } from "@/features/dashboard/services/contact-service";
import { getAudienceCounts, getSentMessages } from "@/features/dashboard/services/sms-service";
import { Topbar } from "@/components/dashboard/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { MessagesView } from "@/components/dashboard/messages-view";

export default async function MessagesPage() {
  const { businessId } = await requireBusinessOwner();
  const [business, contacts, audienceCounts, sentMessages] = await Promise.all([
    getBusiness(businessId),
    getContacts(businessId),
    getAudienceCounts(businessId),
    getSentMessages(businessId),
  ]);
  if (!business) return null;

  return (
    <>
      <Topbar title="پیام‌ها" businessName={business.name} isAcceptingOrders={business.isAcceptingOrders} />
      <PanelContent>
        <MessagesView
          settings={{
            smsProvider: business.smsProvider ?? "",
            smsUsername: business.smsUsername ?? "",
            smsSenderNumber: business.smsSenderNumber ?? "",
            hasApiKey: !!business.smsApiKey,
            smsConnected: business.smsConnected,
            smsCreditCount: business.smsCreditCount,
          }}
          contacts={contacts}
          audienceCounts={audienceCounts}
          sentMessages={sentMessages}
        />
      </PanelContent>
    </>
  );
}
