import { requireSuperAdmin } from "@/features/auth/services/authorize";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
import { getContactMessages } from "@/features/contact/services/contact-service";
import { Topbar } from "@/components/superadmin/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { ContactsView } from "@/components/superadmin/contacts-view";

export default async function SuperAdminContactsPage() {
  const { session } = await requireSuperAdmin();

  const [agent, contacts] = await Promise.all([findUserByPhone(session.phone), getContactMessages()]);

  return (
    <>
      <Topbar title="پیام‌های تماس با ما" agentName={agent?.fullName ?? "سوپرادمین"} />
      <PanelContent>
        <ContactsView contacts={contacts} />
      </PanelContent>
    </>
  );
}
