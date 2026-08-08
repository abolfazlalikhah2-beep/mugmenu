"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { FormToggle } from "@/components/dashboard/form-toggle";
import { updateSettingsAction, type ActionState } from "@/features/dashboard/routes/actions";

export interface SettingsFormValue {
  name: string;
  nameEn: string | null;
  slug: string;
  phone: string | null;
  address: string | null;
  openingHoursStart: string | null;
  openingHoursEnd: string | null;
  acceptsDineIn: boolean;
  acceptsTakeaway: boolean;
  acceptsDelivery: boolean;
  acceptsOnlinePayment: boolean;
  acceptsCashPayment: boolean;
  packagingFee: number;
}

function SettingsCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 rounded-[22px] bg-card p-[26px_28px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
      <div className="text-right">
        <div className="text-[17px] font-semibold">{title}</div>
        <div className="mt-1 text-[13px] font-light text-text-3">{subtitle}</div>
      </div>
      {children}
    </div>
  );
}

function OrderModeRow({ name, label, sub, defaultChecked }: { name: string; label: string; sub: string; defaultChecked: boolean }) {
  return (
    <div className="flex items-center justify-between border-t border-[#F4F4F4] py-3.5 first:border-t-0">
      <div className="text-right">
        <div className="text-sm font-medium">{label}</div>
        <div className="mt-0.5 text-xs font-light text-text-3">{sub}</div>
      </div>
      <FormToggle name={name} defaultChecked={defaultChecked} />
    </div>
  );
}

const initialState: ActionState = {};

export function SettingsView({ business }: { business: SettingsFormValue }) {
  const [state, formAction, pending] = useActionState(updateSettingsAction, initialState);

  return (
    <form action={formAction} className="grid h-full items-start gap-[22px] lg:grid-cols-[1.3fr_1fr]">
      <div className="flex flex-col gap-[22px]">
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
      </div>

      <div className="flex flex-col gap-[22px]">
        <SettingsCard title="روش‌های سفارش" subtitle="کانال‌های فعال دریافت سفارش">
          <div>
            <OrderModeRow
              name="acceptsDineIn"
              label="سرو روی میز"
              sub="ثبت سفارش با شماره میز"
              defaultChecked={business.acceptsDineIn}
            />
            <OrderModeRow
              name="acceptsTakeaway"
              label="بیرون‌بر"
              sub="دریافت حضوری از مجموعه"
              defaultChecked={business.acceptsTakeaway}
            />
            <OrderModeRow
              name="acceptsDelivery"
              label="ارسال با پیک"
              sub="تحویل درب منزل مشتری"
              defaultChecked={business.acceptsDelivery}
            />
          </div>
        </SettingsCard>

        <SettingsCard title="پرداخت" subtitle="درگاه و روش تسویه">
          <div>
            <OrderModeRow
              name="acceptsOnlinePayment"
              label="پرداخت آنلاین"
              sub="اتصال به درگاه بانکی (به‌زودی)"
              defaultChecked={business.acceptsOnlinePayment}
            />
            <OrderModeRow
              name="acceptsCashPayment"
              label="پرداخت در محل"
              sub="نقدی یا کارت‌خوان"
              defaultChecked={business.acceptsCashPayment}
            />
          </div>
          <Input
            name="packagingFee"
            label="هزینه بسته‌بندی (تومان)"
            type="number"
            dir="ltr"
            className="text-right"
            defaultValue={business.packagingFee}
            min={0}
            required
          />
        </SettingsCard>

        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
        {state.ok && <p className="text-right text-xs text-brand">تنظیمات ذخیره شد.</p>}
        <button
          type="submit"
          disabled={pending}
          className="flex h-[50px] items-center justify-center rounded-2xl bg-brand text-base text-white disabled:opacity-60"
        >
          {pending ? "در حال ذخیره…" : "ذخیره تنظیمات"}
        </button>
      </div>
    </form>
  );
}
