"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { SettingsCard } from "@/components/dashboard/settings-card";
import { BusinessHoursRow } from "@/components/dashboard/business-hours-row";
import {
  updateBusinessInfoAction,
  updateBusinessHoursAction,
  type ActionState,
} from "@/features/dashboard/routes/actions";
import { FA_WEEK_ORDER, DEFAULT_BUSINESS_HOURS, type DayHours } from "@/features/menu/utils/business-hours";

export interface BusinessInfoFormValue {
  slug: string;
  name: string;
  nameEn: string | null;
  phone: string | null;
  address: string | null;
}

const initialState: ActionState = {};

export function BusinessInfoTab({
  business,
  hours,
}: {
  business: BusinessInfoFormValue;
  hours: DayHours[];
}) {
  const [infoState, infoAction, infoPending] = useActionState(updateBusinessInfoAction, initialState);
  const [hoursState, hoursAction, hoursPending] = useActionState(updateBusinessHoursAction, initialState);

  return (
    <div className="flex max-w-[720px] flex-col gap-[34px]">
      <form action={infoAction} className="flex flex-col gap-[22px]">
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

        {infoState.error && <p className="text-right text-xs text-red-500">{infoState.error}</p>}
        {infoState.ok && <p className="text-right text-xs text-brand">تنظیمات ذخیره شد.</p>}
        <button
          type="submit"
          disabled={infoPending}
          className="flex h-[50px] items-center justify-center rounded-2xl bg-brand text-base text-white disabled:opacity-60 md:w-fit md:self-start md:px-10"
        >
          {infoPending ? "در حال ذخیره…" : "ذخیره تنظیمات"}
        </button>
      </form>

      <form action={hoursAction} className="flex flex-col gap-[22px]">
        <SettingsCard title="ساعت کاری" subtitle="بازه فعالیت مجموعه، به تفکیک هر روز هفته">
          <div className="flex flex-col gap-3">
            {FA_WEEK_ORDER.map((dayOfWeek) => {
              const day = hours.find((h) => h.dayOfWeek === dayOfWeek) ?? DEFAULT_BUSINESS_HOURS[dayOfWeek];
              return (
                <BusinessHoursRow
                  key={dayOfWeek}
                  dayOfWeek={dayOfWeek}
                  isClosed={day.isClosed}
                  openTime={day.openTime}
                  closeTime={day.closeTime}
                />
              );
            })}
          </div>
        </SettingsCard>

        {hoursState.error && <p className="text-right text-xs text-red-500">{hoursState.error}</p>}
        {hoursState.ok && <p className="text-right text-xs text-brand">ساعت کاری ذخیره شد.</p>}
        <button
          type="submit"
          disabled={hoursPending}
          className="flex h-[50px] items-center justify-center rounded-2xl bg-brand text-base text-white disabled:opacity-60 md:w-fit md:self-start md:px-10"
        >
          {hoursPending ? "در حال ذخیره…" : "ذخیره ساعت کاری"}
        </button>
      </form>
    </div>
  );
}
