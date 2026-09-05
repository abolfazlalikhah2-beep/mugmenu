"use client";

import { useActionState, useState } from "react";
import { Check, UtensilsCrossed, ScrollText, Package, MapPin } from "lucide-react";
import { SettingsCard } from "@/components/dashboard/settings-card";
import { ImageUploadField } from "@/components/uploads/image-upload-field";
import { presignedUploadAction } from "@/features/uploads/client/presigned-upload";
import {
  HERO_BG_KEYS,
  HERO_BG_PRESETS,
  resolveHeroBackground,
  type HeroBgKey,
} from "@/features/menu/utils/hero-background";
import { tintColor } from "@/features/menu/utils/theme-color";
import { updateMenuAppearanceAction, type ActionState } from "@/features/dashboard/routes/actions";

export interface MenuAppearanceFormValue {
  name: string;
  address: string | null;
  accentColor: string;
  logoUrl: string | null;
  heroBgKey: string;
  heroImageUrl: string | null;
  heroOverlayOpacity: number;
}

const SWATCHES = ["#328C3D", "#E1662A", "#2563EB", "#8E2DE2", "#C1398A", "#0F766E"];
const GRADIENT_KEYS = HERO_BG_KEYS.filter((k): k is Exclude<HeroBgKey, "photo"> => k !== "photo");
const DEFAULT_ACCENT = "#328C3D";
const DEFAULT_HERO_BG: HeroBgKey = "g1";
const HEX_COLOR_PATTERN = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;

const initialState: ActionState = {};

export function MenuAppearanceTab({ business }: { business: MenuAppearanceFormValue }) {
  const [state, formAction, pending] = useActionState(updateMenuAppearanceAction, initialState);
  const [accentColor, setAccentColor] = useState(business.accentColor);
  const [hexDraft, setHexDraft] = useState(business.accentColor.toUpperCase());
  const [hexError, setHexError] = useState(false);
  const [logoUrl, setLogoUrl] = useState(business.logoUrl ?? "");
  const [heroBgKey, setHeroBgKey] = useState<HeroBgKey>((business.heroBgKey as HeroBgKey) || DEFAULT_HERO_BG);
  const [heroImageUrl, setHeroImageUrl] = useState(business.heroImageUrl ?? "");
  const [overlayOpacity, setOverlayOpacity] = useState(business.heroOverlayOpacity);

  const background = resolveHeroBackground({ heroBgKey, heroImageUrl: heroImageUrl || null, accentColor });

  /** Single entry point for every way accentColor can change, so the hex text field always mirrors it. */
  function applyAccentColor(color: string) {
    setAccentColor(color);
    setHexDraft(color.toUpperCase());
    setHexError(false);
  }

  function handleHexInput(value: string) {
    setHexDraft(value);
    const normalized = value.trim();
    const candidate = normalized.startsWith("#") ? normalized : `#${normalized}`;
    if (HEX_COLOR_PATTERN.test(candidate)) {
      setAccentColor(candidate);
      setHexError(false);
    } else {
      setHexError(normalized.length > 0);
    }
  }

  function resetToDefault() {
    applyAccentColor(DEFAULT_ACCENT);
    setHeroBgKey(DEFAULT_HERO_BG);
  }

  return (
    <div className="flex flex-col gap-[22px] lg:flex-row lg:items-start">
      <div className="flex justify-center lg:w-[340px] lg:shrink-0">
        <div className="flex w-full flex-col gap-4 rounded-[22px] bg-card p-[22px_20px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-semibold">پیش‌نمایش زنده</span>
            <span
              className="rounded-chip px-3 py-1 text-xs font-medium"
              style={{ color: accentColor, background: tintColor(accentColor, 0.1) }}
            >
              موبایل
            </span>
          </div>
          <div
            className="mx-auto w-[290px] overflow-hidden rounded-[32px] border-[7px] border-[#1C1C1C] bg-card shadow-[0_14px_44px_rgba(0,0,0,0.16)]"
            style={{ "--color-brand": accentColor } as React.CSSProperties}
          >
            <div className="flex h-[26px] items-center justify-between px-4 text-[10px] font-medium">
              <span>۹:۴۱</span>
              <span className="font-mont text-[9px]">5G</span>
            </div>
            <div className="relative h-[140px] w-full overflow-hidden bg-[#2A2A2A]">
              {background.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element -- Liara's proxy 400s /_next/image
                <img src={background.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0" style={{ background: background.css }} />
              )}
              <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity / 100 }} />
            </div>
            <div className="flex items-start gap-2.5 px-4 pt-3.5">
              <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-brand/10 text-[11px] font-bold text-brand">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- Liara's proxy 400s /_next/image
                  <img src={logoUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  "ماگ"
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1 text-right">
                <span className="text-sm font-normal">{business.name}</span>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  <span className="text-[11px] text-brand">سفارش می‌پذیریم</span>
                </div>
                {business.address && (
                  <div className="flex items-center gap-1 text-[10px] font-light text-text-3">
                    <MapPin size={11} />
                    <span className="truncate">{business.address}</span>
                  </div>
                )}
              </div>
            </div>
            <p className="px-4 pt-3 text-center text-[11px]">منوی مورد نظر را بر اساس سفارش خود انتخاب کنید:</p>
            <div className="flex flex-col gap-2 p-4">
              {[
                { label: "بر روی میز", icon: UtensilsCrossed },
                { label: "منو دیداری", icon: ScrollText },
                { label: "سفارش بیرون‌بر", icon: Package },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="flex h-11 items-center gap-2.5 rounded-btn bg-chip px-3.5">
                  <Icon size={17} className="text-brand" />
                  <span className="text-[12.5px] font-light">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <form action={formAction} className="flex flex-1 flex-col gap-[22px]">
        <input type="hidden" name="accentColor" value={accentColor} />
        <input type="hidden" name="heroBgKey" value={heroBgKey} />
        <input type="hidden" name="heroImageUrl" value={heroImageUrl} />
        <input type="hidden" name="heroOverlayOpacity" value={overlayOpacity} />

        <SettingsCard title="رنگ اصلی برند" subtitle="این رنگ جایگزین سبز پیش‌فرض در کل منوی مشتری می‌شود">
          <div className="flex flex-wrap gap-3.5">
            {SWATCHES.map((c) => {
              const active = accentColor.toUpperCase() === c.toUpperCase();
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => applyAccentColor(c)}
                  aria-label={c}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{
                    background: c,
                    boxShadow: active ? `0 0 0 3px #fff, 0 0 0 5px ${c}` : "0px 6px 14px rgba(0,0,0,0.08)",
                  }}
                >
                  {active && <Check size={18} className="text-white" />}
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-right text-[13px] font-light text-text-4">کد رنگ دلخواه</label>
            <div
              className={
                "flex h-[50px] items-center justify-between gap-2 rounded-input border px-4.5 " +
                (hexError ? "border-red-400" : "border-border-input")
              }
            >
              <input
                type="text"
                dir="ltr"
                value={hexDraft}
                onChange={(e) => handleHexInput(e.target.value)}
                placeholder="#328C3D"
                maxLength={7}
                className="min-w-0 flex-1 bg-transparent font-mont text-sm text-[#333] outline-none placeholder:text-[#B8B8B8]"
                aria-label="کد رنگ دلخواه"
              />
              <input
                type="color"
                value={accentColor}
                onChange={(e) => applyAccentColor(e.target.value)}
                className="h-[30px] w-[34px] shrink-0 cursor-pointer border-none bg-transparent p-0"
                aria-label="انتخاب رنگ از پالت"
              />
            </div>
            {hexError && <p className="text-right text-xs text-red-500">کد رنگ نامعتبر است — مثل #328C3D وارد کنید.</p>}
          </div>
        </SettingsCard>

        <SettingsCard title="لوگوی رستوران" subtitle="این لوگو در هدر منوی مشتری نمایش داده می‌شود">
          <ImageUploadField
            kind="logos"
            name="logoUrl"
            defaultUrl={business.logoUrl}
            helpText="jpg، png یا webp، مربعی، حداکثر ۵ مگابایت"
            onUrlChange={setLogoUrl}
          />
        </SettingsCard>

        <SettingsCard title="پس‌زمینه صفحه اول" subtitle="یک تصویر آپلود کنید یا از گرادیانت‌های آماده انتخاب کنید">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
            <div
              className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-4 sm:w-[190px] sm:shrink-0"
              style={{ borderColor: heroBgKey === "photo" ? accentColor : "#CFCFCF" }}
            >
              <ImageUploadField
                kind="hero"
                name="heroImageUrlUpload"
                defaultUrl={business.heroImageUrl}
                boxClassName="h-[64px] w-full rounded-xl"
                helpText="jpg یا png، ۱۶:۹، حداکثر ۵ مگابایت"
                action={presignedUploadAction}
                onUrlChange={(url) => {
                  setHeroImageUrl(url);
                  setHeroBgKey("photo");
                }}
              />
              {heroImageUrl && heroBgKey !== "photo" && (
                <button
                  type="button"
                  onClick={() => setHeroBgKey("photo")}
                  className="text-[11px] font-medium"
                  style={{ color: accentColor }}
                >
                  استفاده از این تصویر
                </button>
              )}
            </div>
            <div className="grid flex-1 grid-cols-2 gap-3">
              {GRADIENT_KEYS.map((key) => {
                const preset = HERO_BG_PRESETS[key];
                const active = heroBgKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setHeroBgKey(key)}
                    className="relative flex h-[74px] items-end overflow-hidden rounded-2xl p-2.5"
                    style={{
                      background: preset.css(accentColor),
                      border: active ? `2px solid ${accentColor}` : "1px solid #EAEAEA",
                    }}
                  >
                    <span
                      className="rounded-chip px-2 py-1 text-[11px] font-medium"
                      style={{
                        color: key === "g3" ? "#5F5F5F" : "#fff",
                        background: key === "g3" ? "rgba(255,255,255,.75)" : "rgba(0,0,0,0.3)",
                      }}
                    >
                      {preset.label}
                    </span>
                    {active && (
                      <span
                        className="absolute top-2 right-2 flex h-[20px] w-[20px] items-center justify-center rounded-full"
                        style={{ background: accentColor }}
                      >
                        <Check size={12} className="text-white" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[14px_18px]">
            <div className="text-right">
              <div className="text-sm font-medium">تیرگی روی تصویر</div>
              <div className="mt-0.5 text-xs font-light text-text-3">برای خوانایی بهتر روی تصویر</div>
            </div>
            <input
              type="range"
              min={0}
              max={80}
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(Number(e.target.value))}
              className="w-[160px]"
              style={{ accentColor }}
              aria-label="تیرگی روی تصویر"
            />
          </div>
        </SettingsCard>

        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
        {state.ok && <p className="text-right text-xs text-brand">تنظیمات ذخیره شد.</p>}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="flex h-[50px] items-center justify-center rounded-2xl bg-brand px-10 text-base text-white disabled:opacity-60"
          >
            {pending ? "در حال ذخیره…" : "ذخیره ظاهر منو"}
          </button>
          <button
            type="button"
            onClick={resetToDefault}
            className="flex h-[50px] items-center justify-center rounded-2xl border border-[#DDD] bg-card px-6 text-[15px] text-[#777]"
          >
            بازگردانی به پیش‌فرض
          </button>
        </div>
      </form>
    </div>
  );
}
