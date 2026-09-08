"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { updateCustomDomainAction, type ActionState } from "@/features/superadmin/routes/actions";

const initialState: ActionState = {};

export function CustomDomainForm({ businessId, customDomain }: { businessId: string; customDomain: string | null }) {
  const action = updateCustomDomainAction.bind(null, businessId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-2xl border border-[#EFEFEF] bg-card p-[16px_18px]">
      <span className="text-[13px] font-medium text-text-1">دامنه اختصاصی</span>
      <div className="flex flex-wrap items-end gap-3">
        <Input
          name="customDomain"
          dir="ltr"
          defaultValue={customDomain ?? ""}
          placeholder="example.com"
          className="text-right"
        />
        <button
          type="submit"
          disabled={pending}
          className="flex h-[50px] items-center justify-center rounded-xl bg-brand px-4 text-[13px] font-medium text-white disabled:opacity-50"
        >
          {pending ? "در حال ثبت…" : "ذخیره"}
        </button>
      </div>
      <p className="text-right text-[11px] font-light text-text-3">
        برای رفع اتصال دامنه، فیلد را خالی بگذارید و ذخیره کنید. تنظیم رکورد DNS سمت مشتری همچنان لازم است.
      </p>
      {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      {state.ok && <p className="text-right text-xs text-brand">دامنه ذخیره شد.</p>}
    </form>
  );
}
