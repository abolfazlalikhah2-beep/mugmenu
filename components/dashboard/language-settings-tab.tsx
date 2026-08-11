"use client";

import { useActionState, useMemo, useState } from "react";
import { Globe } from "lucide-react";
import { SettingsCard, OrderModeRow } from "@/components/dashboard/settings-card";
import { Toggle } from "@/components/dashboard/toggle";
import {
  updateLanguageSettingsAction,
  updateProductTranslationsAction,
  type ActionState,
} from "@/features/dashboard/routes/actions";

export interface LanguageSettingsFormValue {
  bilingualMenuEnabled: boolean;
  askLanguageOnEntry: boolean;
  rememberCustomerLanguage: boolean;
}

export interface ProductTranslationRow {
  id: string;
  name: string;
  nameEn: string | null;
  descriptionEn: string | null;
}

const initialState: ActionState = {};

function LangPill({ code, label }: { code: string; label: string }) {
  return (
    <div className="flex h-12 items-center justify-between rounded-input border border-border-input px-4">
      <div className="flex items-center gap-2.5">
        <span className="rounded-chip bg-brand px-2 py-0.5 font-mont text-xs font-bold text-white">{code}</span>
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
}

export function LanguageSettingsTab({
  business,
  products,
}: {
  business: LanguageSettingsFormValue;
  products: ProductTranslationRow[];
}) {
  const [state, formAction, pending] = useActionState(updateLanguageSettingsAction, initialState);
  const [bilingual, setBilingual] = useState(business.bilingualMenuEnabled);

  const [rows, setRows] = useState(() =>
    products.map((p) => ({ productId: p.id, name: p.name, nameEn: p.nameEn ?? "", descriptionEn: p.descriptionEn ?? "" }))
  );
  const [transState, transAction, transPending] = useActionState(updateProductTranslationsAction, initialState);

  const translatedCount = useMemo(() => rows.filter((r) => r.nameEn.trim().length > 0).length, [rows]);

  function updateRow(productId: string, field: "nameEn" | "descriptionEn", value: string) {
    setRows((prev) => prev.map((r) => (r.productId === productId ? { ...r, [field]: value } : r)));
  }

  return (
    <div className="flex flex-col gap-[22px]">
      <form action={formAction} className="flex flex-col gap-[22px]">
        <SettingsCard title="منوی چندزبانه" subtitle="فعال‌سازی نمایش منو به چند زبان برای مشتریان خارجی">
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[16px_18px]">
            <div className="flex items-center gap-3.5">
              <div className="flex h-[46px] w-[46px] items-center justify-center rounded-2xl bg-brand/10">
                <Globe size={22} className="text-brand" />
              </div>
              <div className="text-right">
                <div className="text-[15px] font-semibold">فعال‌سازی منوی دوزبانه</div>
                <div className="mt-0.5 text-xs font-light text-text-3">
                  مشتری هنگام ورود زبان را انتخاب می‌کند یا از تاگل هدر عوض می‌کند
                </div>
              </div>
            </div>
            <input type="checkbox" hidden readOnly checked={bilingual} name="bilingualMenuEnabled" />
            <Toggle checked={bilingual} onChange={setBilingual} />
          </div>

          <div className={bilingual ? "flex flex-col gap-4" : "flex flex-col gap-4 opacity-50"}>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-1 flex-col gap-2">
                <label className="text-right text-[13px] font-light text-text-4">زبان پیش‌فرض</label>
                <LangPill code="FA" label="فارسی" />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <label className="text-right text-[13px] font-light text-text-4">زبان دوم</label>
                <LangPill code="EN" label="English" />
              </div>
            </div>

            <OrderModeRow
              name="askLanguageOnEntry"
              label="پرسش زبان هنگام ورود"
              sub="صفحه انتخاب زبان قبل از نمایش منو نمایش داده شود"
              defaultChecked={business.askLanguageOnEntry}
            />
            <OrderModeRow
              name="rememberCustomerLanguage"
              label="ذخیره زبان مشتری"
              sub="دفعه بعد مستقیم به زبان انتخابی وارد شود"
              defaultChecked={business.rememberCustomerLanguage}
            />
          </div>
        </SettingsCard>

        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
        {state.ok && <p className="text-right text-xs text-brand">تنظیمات ذخیره شد.</p>}
        <div>
          <button
            type="submit"
            disabled={pending}
            className="flex h-[50px] items-center justify-center rounded-2xl bg-brand px-10 text-base text-white disabled:opacity-60"
          >
            {pending ? "در حال ذخیره…" : "ذخیره تنظیمات زبان"}
          </button>
        </div>
      </form>

      <form
        action={transAction}
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          const input = e.currentTarget.elements.namedItem("translations") as HTMLInputElement;
          input.value = JSON.stringify(rows);
        }}
      >
        <input type="hidden" name="translations" />
        <SettingsCard
          title="ترجمه آیتم‌های منو"
          subtitle="نام و توضیح آیتم‌ها را به زبان دوم وارد کنید — اختیاری، آیتم‌های بدون ترجمه با نام فارسی نمایش داده می‌شوند"
        >
          {rows.length === 0 ? (
            <p className="py-6 text-center text-sm font-light text-text-3">هنوز محصولی ثبت نشده است.</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[#F0F0F0]">
              <div className="min-w-[640px]">
                <div className="grid grid-cols-[2fr_2fr_2fr] gap-3 border-b border-[#F0F0F0] bg-[#FAFBFA] px-4.5 py-3 text-right text-[13px] font-light text-[#A0A0A0]">
                  <span>نام فارسی</span>
                  <span>نام انگلیسی</span>
                  <span>توضیح انگلیسی</span>
                </div>
                {rows.map((r, i) => (
                  <div
                    key={r.productId}
                    className={`grid grid-cols-[2fr_2fr_2fr] items-center gap-3 px-4.5 py-3 ${i ? "border-t border-[#F4F4F4]" : ""}`}
                  >
                    <span className="text-[13.5px] font-medium">{r.name}</span>
                    <input
                      dir="ltr"
                      value={r.nameEn}
                      onChange={(e) => updateRow(r.productId, "nameEn", e.target.value)}
                      placeholder="ترجمه نشده"
                      className="h-9 rounded-input border border-border-input px-3 font-mont text-xs outline-none focus:border-brand"
                    />
                    <input
                      dir="ltr"
                      value={r.descriptionEn}
                      onChange={(e) => updateRow(r.productId, "descriptionEn", e.target.value)}
                      placeholder="—"
                      className="h-9 rounded-input border border-border-input px-3 font-mont text-xs outline-none focus:border-brand"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-[12.5px] font-light text-text-3">
              {translatedCount} از {rows.length} آیتم ترجمه شده
            </span>
          </div>
          {transState.error && <p className="text-right text-xs text-red-500">{transState.error}</p>}
          {transState.ok && <p className="text-right text-xs text-brand">ترجمه‌ها ذخیره شد.</p>}
        </SettingsCard>
        <div>
          <button
            type="submit"
            disabled={transPending || rows.length === 0}
            className="flex h-[50px] items-center justify-center rounded-2xl bg-brand px-10 text-base text-white disabled:opacity-60"
          >
            {transPending ? "در حال ذخیره…" : "ذخیره ترجمه‌ها"}
          </button>
        </div>
      </form>
    </div>
  );
}
