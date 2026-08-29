"use client";

import { useActionState, useEffect } from "react";
import { ModalShell } from "@/components/dashboard/modal-shell";
import { Input } from "@/components/ui/input";
import { updateCustomerProfileAction, type ActionState } from "@/features/customer/routes/actions";
import { menuCopy, type MenuLang } from "@/features/menu/utils/menu-language";

const initialState: ActionState = {};

export function ProfileEditModal({
  slug,
  fullName,
  birthDate,
  onClose,
  lang = "fa",
}: {
  slug: string;
  fullName: string;
  /** ISO date string (YYYY-MM-DD), suitable as an <input type="date"> defaultValue. */
  birthDate?: string;
  onClose: () => void;
  lang?: MenuLang;
}) {
  const action = updateCustomerProfileAction.bind(null, slug);
  const [state, formAction, pending] = useActionState(action, initialState);
  const t = menuCopy(lang);

  useEffect(() => {
    if (state.ok) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <ModalShell
      title={t.editProfileTitle}
      onClose={onClose}
      footer={
        <button
          type="submit"
          form="profile-edit-form"
          disabled={pending}
          className="flex h-[50px] flex-1 items-center justify-center rounded-2xl bg-brand text-base text-white disabled:opacity-60"
        >
          {pending ? t.saving : t.save}
        </button>
      }
    >
      <form id="profile-edit-form" action={formAction} className="flex flex-col gap-3">
        <Input name="fullName" label={t.fullNameLabel} defaultValue={fullName} required />
        <Input type="date" name="birthDate" label={t.birthDateLabel} dir="ltr" defaultValue={birthDate} className="text-right" />
        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      </form>
    </ModalShell>
  );
}
