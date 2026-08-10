"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { NewTicketForCustomerModal, type BusinessOption } from "@/components/superadmin/new-ticket-for-customer-modal";

export function NewTicketTrigger({
  businesses,
  initialBusinessId,
}: {
  businesses: BusinessOption[];
  initialBusinessId?: string;
}) {
  const [open, setOpen] = useState(Boolean(initialBusinessId));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-[44px] items-center gap-2 rounded-[13px] bg-brand px-[18px] text-sm font-medium text-white"
      >
        <Plus size={17} />
        تیکت جدید برای مشتری
      </button>
      {open && (
        <NewTicketForCustomerModal
          businesses={businesses}
          initialBusinessId={initialBusinessId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
