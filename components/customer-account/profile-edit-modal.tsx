"use client";

import { useActionState, useEffect } from "react";
import { ModalShell } from "@/components/dashboard/modal-shell";
import { Input } from "@/components/ui/input";
import { updateCustomerProfileAction, type ActionState } from "@/features/customer/routes/actions";

const initialState: ActionState = {};

export function ProfileEditModal({
  slug,
  fullName,
  onClose,
}: {
  slug: string;
  fullName: string;
  onClose: () => void;
}) {
  const action = updateCustomerProfileAction.bind(null, slug);
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.ok) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <ModalShell
      title="ویرایش نام"
      onClose={onClose}
      footer={
        <button
          type="submit"
          form="profile-edit-form"
          disabled={pending}
          className="flex h-[50px] flex-1 items-center justify-center rounded-2xl bg-brand text-base text-white disabled:opacity-60"
        >
          {pending ? "در حال ذخیره…" : "ذخیره"}
        </button>
      }
    >
      <form id="profile-edit-form" action={formAction} className="flex flex-col gap-3">
        <Input name="fullName" label="نام و نام خانوادگی" defaultValue={fullName} required />
        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      </form>
    </ModalShell>
  );
}
