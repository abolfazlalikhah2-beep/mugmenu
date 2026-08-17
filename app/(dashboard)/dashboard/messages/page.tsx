import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { getContacts } from "@/features/dashboard/services/contact-service";
import { getAudienceCounts, getSentMessages } from "@/features/dashboard/services/sms-service";
import { businessHasFeature } from "@/features/plans/services/plan-service";
import { Topbar } from "@/components/dashboard/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { MessagesView } from "@/components/dashboard/messages-view";
import { UpgradeGate } from "@/components/dashboard/upgrade-gate";

export default async function MessagesPage() {
  const { businessId } = await requireBusinessOwner();
  const [business, hasSmsPanel] = await Promise.all([
    getBusiness(businessId),
    businessHasFeature(businessId, "sms.panel"),
  ]);
  if (!business) return null;

  const data = hasSmsPanel
    ? await Promise.all([getContacts(businessId), getAudienceCounts(businessId), getSentMessages(businessId)])
    : null;

  return (
    <>
      <Topbar title="پیام‌ها" businessName={business.name} />
      <PanelContent>
        <UpgradeGate allowed={hasSmsPanel} title="پنل پیامک در پلن شما موجود نیست">
          {data && (
            <MessagesView
              settings={{
                smsProvider: business.smsProvider ?? "",
                smsUsername: business.smsUsername ?? "",
                smsSenderNumber: business.smsSenderNumber ?? "",
                hasApiKey: !!business.smsApiKey,
                smsConnected: business.smsConnected,
                smsCreditCount: business.smsCreditCount,
              }}
              contacts={data[0]}
              audienceCounts={data[1]}
              sentMessages={data[2]}
            />
          )}
        </UpgradeGate>
      </PanelContent>
    </>
  );
}
