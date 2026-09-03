"use client";

import { ContactMessageRow, type ContactMessageData } from "@/components/superadmin/contact-message-row";

export function ContactsView({ contacts }: { contacts: ContactMessageData[] }) {
  const unreadCount = contacts.filter((c) => !c.isRead).length;

  return (
    <div className="flex flex-col gap-[18px] rounded-[22px] bg-card p-[24px_26px_14px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
      <div className="text-right">
        <div className="text-[17px] font-semibold">پیام‌های تماس با ما</div>
        <div className="mt-1 text-xs font-light text-text-3">
          {contacts.length.toLocaleString("fa-IR")} پیام · {unreadCount.toLocaleString("fa-IR")} خوانده‌نشده
        </div>
      </div>
      <div className="flex flex-col">
        {contacts.length === 0 && <div className="p-6 text-center text-sm text-text-3">پیامی ثبت نشده است.</div>}
        {contacts.map((c, i) => (
          <ContactMessageRow key={c.id} contact={c} isFirst={i === 0} />
        ))}
      </div>
    </div>
  );
}
