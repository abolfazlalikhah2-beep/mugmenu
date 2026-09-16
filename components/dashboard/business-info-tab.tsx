"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { SettingsCard } from "@/components/dashboard/settings-card";
import { BusinessHoursRow } from "@/components/dashboard/business-hours-row";
import { LocationPicker } from "@/components/dashboard/location-picker";
import { UpgradeLockBadge } from "@/components/dashboard/upgrade-gate";
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
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  customDomain: string | null;
}

const initialState: ActionState = {};

export function BusinessInfoTab({
  business,
  hours,
  googleMapsApiKey,
  hasCustomDomain,
}: {
  business: BusinessInfoFormValue;
  hours: DayHours[];
  googleMapsApiKey?: string;
  hasCustomDomain: boolean;
}) {
  const [infoState, infoAction, infoPending] = useActionState(updateBusinessInfoAction, initialState);
  const [hoursState, hoursAction, hoursPending] = useActionState(updateBusinessHoursAction, initialState);

  return (
    <div className="grid grid-cols-1 items-start gap-[24px] md:grid-cols-2">
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
          <div className="flex flex-col gap-2">
            <label className="text-right text-[13px] font-light text-text-4">موقعیت روی نقشه</label>
            <LocationPicker
              apiKey={googleMapsApiKey}
              latitude={business.latitude}
              longitude={business.longitude}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-right text-[13px] font-light text-text-4">توضیحات مجموعه</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={business.description ?? ""}
              className="min-h-[70px] rounded-input border border-border-input p-[12px_16px] text-right text-[13px] leading-[1.9] text-[#555] outline-none focus:border-brand"
            />
          </div>
        </SettingsCard>

        <SettingsCard title="دامنه اختصاصی" subtitle="اتصال دامنه شخصی خودتان به منوی آنلاین">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <label className="text-right text-[13px] font-light text-text-4">نام دامنه اختصاصی</label>
              {!hasCustomDomain && <UpgradeLockBadge />}
            </div>
            <Input
              name="customDomain"
              dir="ltr"
              className="text-right"
              placeholder="example.com"
              defaultValue={business.customDomain ?? ""}
              disabled={!hasCustomDomain}
            />
            <p className="text-right text-[11px] font-light text-text-4">
              برای اتصال دامنه اختصاصی، در پنل آروان‌کلاد یک رکورد CNAME با مقدار serwapp.com ایجاد کنید و سپس دامنه
              خود را اینجا وارد کنید.
            </p>
          </div>
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
