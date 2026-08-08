"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { SettingsCard } from "@/components/dashboard/settings-card";
import { updateBusinessInfoAction, type ActionState } from "@/features/dashboard/routes/actions";

export interface BusinessInfoFormValue {
  slug: string;
  name: string;
  nameEn: string | null;
  phone: string | null;
  address: string | null;
  openingHoursStart: string | null;
  openingHoursEnd: string | null;
}

const initialState: ActionState = {};

export function BusinessInfoTab({ business }: { business: BusinessInfoFormValue }) {
  const [state, formAction, pending] = useActionState(updateBusinessInfoAction, initialState);

  return (
    <form action={formAction} className="flex max-w-[720px] flex-col gap-[22px]">
      <SettingsCard title="اطلاعات فروشگاه" subtitle="این اطلاعات در صفحه عمومی منو نمایش داده می‌شود">
        <div className="flex flex-col gap-2">
          <label className="text-right text-[13px] font-light text-text-4">شناسه (آیدی)</label>
          <div
            dir="ltr"
            className="flex h-[50px] items-center justify-end rounded-input border border-border-input bg-[#F6F6F6] px-[18px] text-right text-[15px] text-text-3"
          >
            @{business.slug}
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Input name="name" label="نام مجموعه" defaultValue={business.name} required className="flex-1" />
          <Input
            name="nameEn"
            label="نام انگلیسی"
            dir="ltr"
            className="flex-1 text-right"
            defaultValue={business.nameEn ?? ""}
          />
        </div>
        <Input
          name="phone"
          label="شماره تماس"
          dir="ltr"
          className="text-right"
          defaultValue={business.phone ?? ""}
          required
        />
        <Input name="address" label="آدرس" defaultValue={business.address ?? ""} required />
      </SettingsCard>

      <SettingsCard title="ساعت کاری" subtitle="بازه فعالیت روزانه مجموعه">
        <div className="flex gap-4">
          <Input
            name="openingHoursStart"
            label="ساعت شروع"
            dir="ltr"
            className="flex-1 text-right"
            defaultValue={business.openingHoursStart ?? ""}
            placeholder="15:00"
            required
          />
          <Input
            name="openingHoursEnd"
            label="ساعت پایان"
            dir="ltr"
            className="flex-1 text-right"
            defaultValue={business.openingHoursEnd ?? ""}
            placeholder="00:00"
            required
          />
        </div>
      </SettingsCard>

      {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      {state.ok && <p className="text-right text-xs text-brand">تنظیمات ذخیره شد.</p>}
      <button
        type="submit"
        disabled={pending}
        className="flex h-[50px] items-center justify-center rounded-2xl bg-brand text-base text-white disabled:opacity-60 md:w-fit md:self-start md:px-10"
      >
        {pending ? "در حال ذخیره…" : "ذخیره تنظیمات"}
      </button>
    </form>
  );
}
