"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { ImageUploadField } from "@/components/uploads/image-upload-field";
import { updateSiteSettingsAction, type ActionState } from "@/features/site-settings/routes/actions";
import { uploadSiteSettingImageAction } from "@/features/uploads/routes/actions";
import type { SiteSettingsValue } from "@/features/site-settings/services/site-setting-service";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "contact", label: "اطلاعات تماس" },
  { key: "appearance", label: "ظاهر سایت" },
  { key: "home", label: "صفحه اصلی" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const initialState: ActionState = {};

function SectionCard({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 rounded-[22px] bg-card p-[26px_28px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]",
        !active && "hidden"
      )}
    >
      {children}
    </div>
  );
}

export function SiteSettingsView({ settings }: { settings: SiteSettingsValue }) {
  const [state, formAction, pending] = useActionState(updateSiteSettingsAction, initialState);
  const [tab, setTab] = useState<TabKey>("contact");

  return (
    <form action={formAction} className="flex flex-col gap-[22px]">
      <div className="flex gap-2 rounded-2xl bg-[#F0F0F0] p-1.5">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors",
              tab === t.key ? "bg-card text-brand shadow-[0px_2px_6px_rgba(0,0,0,0.06)]" : "text-text-3"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <SectionCard active={tab === "contact"}>
        <div className="text-right text-[17px] font-semibold">اطلاعات تماس</div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input name="site_name" label="نام سایت" defaultValue={settings.site_name} className="text-right" />
          <Input
            name="site_tagline"
            label="شعار سایت"
            defaultValue={settings.site_tagline}
            className="text-right"
          />
          <Input
            name="contact_email"
            type="email"
            dir="ltr"
            label="ایمیل تماس"
            defaultValue={settings.contact_email}
            className="text-right"
          />
          <Input
            name="contact_phone"
            dir="ltr"
            label="شماره تلفن"
            defaultValue={settings.contact_phone}
            className="text-right"
          />
          <Input
            name="social_instagram"
            dir="ltr"
            label="لینک اینستاگرام"
            defaultValue={settings.social_instagram}
            className="text-right"
          />
          <Input
            name="social_telegram"
            dir="ltr"
            label="لینک تلگرام"
            defaultValue={settings.social_telegram}
            className="text-right"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-right text-[13px] font-light text-text-4">آدرس</label>
          <textarea
            name="contact_address"
            rows={3}
            defaultValue={settings.contact_address}
            className="min-h-[76px] rounded-input border border-border-input p-[12px_16px] text-right text-[13px] leading-[1.9] text-[#555] outline-none focus:border-brand"
          />
        </div>
      </SectionCard>

      <SectionCard active={tab === "appearance"}>
        <div className="text-right text-[17px] font-semibold">ظاهر سایت</div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <ImageUploadField
            kind="site-settings"
            name="logo_url"
            label="لوگو"
            defaultUrl={settings.logo_url}
            action={uploadSiteSettingImageAction}
          />
          <ImageUploadField
            kind="site-settings"
            name="favicon_url"
            label="فاویکون"
            defaultUrl={settings.favicon_url}
            action={uploadSiteSettingImageAction}
            boxClassName="h-[64px] w-[64px]"
          />
        </div>
      </SectionCard>

      <SectionCard active={tab === "home"}>
        <div className="text-right text-[17px] font-semibold">صفحه اصلی</div>
        <Input
          name="hero_headline"
          label="تیتر اصلی"
          defaultValue={settings.hero_headline}
          className="text-right"
        />
        <div className="flex flex-col gap-2">
          <label className="text-right text-[13px] font-light text-text-4">زیرتیتر</label>
          <textarea
            name="hero_subheadline"
            rows={3}
            defaultValue={settings.hero_subheadline}
            className="min-h-[76px] rounded-input border border-border-input p-[12px_16px] text-right text-[13px] leading-[1.9] text-[#555] outline-none focus:border-brand"
          />
        </div>
      </SectionCard>

      {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      {state.ok && <p className="text-right text-xs text-brand">تنظیمات ذخیره شد.</p>}
      <button
        type="submit"
        disabled={pending}
        className="flex h-[50px] w-full items-center justify-center rounded-2xl bg-brand text-base font-medium text-white disabled:opacity-60 sm:w-auto sm:self-start sm:px-10"
      >
        {pending ? "در حال ذخیره…" : "ذخیره تغییرات"}
      </button>
    </form>
  );
}
