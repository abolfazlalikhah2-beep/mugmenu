"use client";

import { useActionState, useEffect } from "react";
import { ModalShell } from "@/components/dashboard/modal-shell";
import { Input } from "@/components/ui/input";
import { createContactAction, type ActionState } from "@/features/dashboard/routes/actions";

const initialState: ActionState = {};

export function ContactModal({ onClose }: { onClose: () => void }) {
  const [state, formAction, pending] = useActionState(createContactAction, initialState);

  useEffect(() => {
    if (state.ok) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <ModalShell
      title="افزودن شماره"
      subtitle="یک مخاطب تازه به دفترچه شماره اضافه کنید"
      maxWidth={480}
      onClose={onClose}
      footer={
        <>
          <button
            type="submit"
            form="contact-form"
            disabled={pending}
            className="flex h-[50px] flex-1 items-center justify-center rounded-2xl bg-brand text-base text-white disabled:opacity-60"
          >
            {pending ? "در حال ذخیره…" : "افزودن"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[50px] w-[120px] items-center justify-center rounded-2xl border border-[#DDD] bg-card text-[15px] text-[#777]"
          >
            انصراف
          </button>
        </>
      }
    >
      <form id="contact-form" action={formAction} className="flex flex-col gap-[18px]">
        <Input name="name" label="نام مخاطب" placeholder="مثلاً علی رضایی" required />
        <Input
          name="phone"
          label="شماره موبایل"
          placeholder="0912 000 0000"
          dir="ltr"
          className="text-right"
          required
        />
        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      </form>
    </ModalShell>
  );
}
