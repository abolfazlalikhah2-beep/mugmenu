"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/uploads/image-upload-field";
import { onboardingAction, type ActionState } from "@/features/dashboard/routes/actions";

const initialState: ActionState = {};

const STEPS = ["مشخصات", "آدرس", "پایان"];

export default function OnboardingPage() {
  const [state, formAction, pending] = useActionState(onboardingAction, initialState);

  return (
    <div
      className="flex min-h-screen items-center justify-center p-6 md:p-10"
      style={{ background: "linear-gradient(135deg,#F2F3F1 0%,#E7E8E7 100%)" }}
    >
      <div className="flex w-full max-w-[720px] flex-col gap-6 rounded-card bg-card p-6 shadow-modal md:p-11">
        <div className="flex flex-col gap-1.5 text-center">
          <h1 className="text-2xl font-semibold">تکمیل اطلاعات مجموعه</h1>
          <p className="text-[13px] font-light text-text-3">
            قبل از ورود به پنل، مشخصات رستوران خود را کامل کنید
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <span
                  className={
                    "flex h-[26px] w-[26px] items-center justify-center rounded-full text-[13px] " +
                    (i === 0 ? "bg-brand text-white" : "bg-[#EDEDED] text-[#9A9A9A]")
                  }
                >
                  {(i + 1).toLocaleString("fa-IR")}
                </span>
                <span className={"text-[13px] " + (i === 0 ? "font-medium text-brand" : "text-[#9A9A9A]")}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && <span className="h-px w-[34px] bg-[#E5E5E5]" />}
            </div>
          ))}
        </div>

        <form action={formAction} className="flex flex-col gap-5">
          <ImageUploadField
            kind="logos"
            name="logoUrl"
            label="لوگوی مجموعه"
            helpText="تصویر مربعی با کیفیت، حداکثر ۵ مگابایت"
          />

          <div className="flex flex-col gap-4 sm:flex-row">
            <Input name="name" label="نام مجموعه" required className="flex-1" />
            <Input name="nameEn" label="نام انگلیسی" dir="ltr" className="flex-1 text-right" />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Input name="slug" label="شناسه (آیدی)" dir="ltr" className="flex-1 text-right" required />
            <Input
              name="phone"
              label="شماره تماس"
              dir="ltr"
              className="flex-1 text-right"
              inputMode="numeric"
              required
            />
          </div>
          <Input name="address" label="آدرس" required />
          <div className="flex flex-col gap-1.5">
            <Input name="customDomain" label="نام دامنه اختصاصی" dir="ltr" className="text-right" placeholder="example.com" />
            <p className="text-right text-[11px] font-light text-text-4">
              فقط برای پلن‌های «منو سفارش» و «منو پیشرفته» فعال است — اتصال واقعی دامنه بعداً از پشتیبانی پیگیری می‌شود.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-right text-[13px] font-light text-text-4">توضیحات مجموعه</label>
            <textarea
              name="description"
              rows={3}
              className="min-h-[70px] rounded-input border border-border-input p-[12px_16px] text-right text-[13px] leading-[1.9] text-[#555] outline-none focus:border-brand"
            />
          </div>

          {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}

          <Button variant="primary" type="submit" disabled={pending} className="w-full">
            {pending ? "در حال ثبت…" : "ثبت و ورود به پنل"}
          </Button>
        </form>
      </div>
    </div>
  );
}
