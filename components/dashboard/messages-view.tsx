"use client";

import { useState } from "react";
import { SmsSettingsTab, type SmsSettingsFormValue } from "@/components/dashboard/sms-settings-tab";
import { SingleSendTab } from "@/components/dashboard/single-send-tab";
import { PhonebookTab } from "@/components/dashboard/phonebook-tab";
import { BulkSendTab, type AudienceCounts } from "@/components/dashboard/bulk-send-tab";
import { SentHistoryTab } from "@/components/dashboard/sent-history-tab";
import type { ContactRowData } from "@/components/dashboard/contact-row";
import type { SentMessageRowData } from "@/components/dashboard/sent-row";
import { cn } from "@/lib/utils";

const TABS = ["تنظیمات پیامک", "ارسال تکی", "دفترچه شماره", "ارسال دسته‌جمعی", "ارسال‌شده‌ها"] as const;

export function MessagesView({
  settings,
  contacts,
  audienceCounts,
  sentMessages,
}: {
  settings: SmsSettingsFormValue;
  contacts: ContactRowData[];
  audienceCounts: AudienceCounts;
  sentMessages: SentMessageRowData[];
}) {
  const [tab, setTab] = useState(0);

  return (
    <div className="flex h-full flex-col gap-[22px]">
      <div className="flex flex-wrap gap-2.5">
        {TABS.map((t, i) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(i)}
            className={cn(
              "flex h-[38px] items-center rounded-[11px] px-[18px] text-sm",
              tab === i ? "bg-[#EAF3EB] font-medium text-brand" : "font-normal text-[#8A8A8A]"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        {tab === 0 && <SmsSettingsTab settings={settings} />}
        {tab === 1 && <SingleSendTab />}
        {tab === 2 && <PhonebookTab contacts={contacts} />}
        {tab === 3 && <BulkSendTab contacts={contacts} counts={audienceCounts} />}
        {tab === 4 && <SentHistoryTab messages={sentMessages} />}
      </div>
    </div>
  );
}
