"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { CustomerBrandHeader } from "@/components/customer-account/customer-brand-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendCustomerOtpAction, type ActionState } from "@/features/customer/routes/actions";

const initialState: ActionState = {};

export function CustomerLoginForm({ slug, businessName }: { slug: string; businessName: string }) {
  const action = sendCustomerOtpAction.bind(null, slug);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div className="flex flex-col">
      <div className="h-[95px] bg-gradient-to-br from-brand to-[#245F2B]" />
      <div className="-mt-9 rounded-t-[28px] bg-card px-5 pb-6">
        <CustomerBrandHeader
          businessName={businessName}
          subtitle="برای ثبت سفارش، دریافت کش‌بک و امتیاز باشگاه مشتریان وارد شوید"
        />
        <form action={formAction} className="flex flex-col gap-4.5">
          <Input
            name="phone"
            label="شماره موبایل"
            dir="ltr"
            className="text-right"
            inputMode="numeric"
            placeholder="0912 345 6789"
            required
          />
          {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
          <Button variant="primary" type="submit" disabled={pending} className="w-full">
            {pending ? "در حال ارسال…" : "دریافت کد تایید"}
          </Button>
          <div className="flex items-start gap-2">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-text-3" />
            <span className="text-[11.5px] font-light leading-7 text-text-3">
              با ورود، قوانین و حریم خصوصی ماگ‌منو را می‌پذیرید. شماره شما فقط برای پیگیری سفارش استفاده می‌شود.
            </span>
          </div>
        </form>
      </div>
      <div className="mt-auto flex flex-col items-center gap-3 px-5 py-6">
        <Link href={`/${slug}`} className="w-full">
          <Button variant="secondary" className="w-full">
            ادامه بدون ورود
          </Button>
        </Link>
      </div>
    </div>
  );
}
