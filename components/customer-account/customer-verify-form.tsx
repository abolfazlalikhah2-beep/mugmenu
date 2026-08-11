"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { CustomerBrandHeader } from "@/components/customer-account/customer-brand-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  verifyCustomerOtpAction,
  resendCustomerOtpAction,
  type ActionState,
} from "@/features/customer/routes/actions";
import { menuCopy, verifySubtitleLabel, resendCountdownLabel, type MenuLang } from "@/features/menu/utils/menu-language";

const initialState: ActionState = {};
const RESEND_SECONDS = 60;

export function CustomerVerifyForm({
  slug,
  businessName,
  phone,
  lang = "fa",
}: {
  slug: string;
  businessName: string;
  phone: string;
  lang?: MenuLang;
}) {
  const action = verifyCustomerOtpAction.bind(null, slug);
  const [state, formAction, pending] = useActionState(action, initialState);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [isResending, startResend] = useTransition();
  const [resendError, setResendError] = useState<string | null>(null);
  const t = menuCopy(lang);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  function handleResend() {
    startResend(async () => {
      const result = await resendCustomerOtpAction(slug, phone);
      if (!result.ok) {
        setResendError(result.error);
        return;
      }
      setResendError(null);
      setSecondsLeft(RESEND_SECONDS);
    });
  }

  return (
    <div className="flex flex-col">
      <div className="px-5">
        <CustomerBrandHeader businessName={businessName} subtitle={verifySubtitleLabel(lang, phone)} />
        <form action={formAction} className="flex flex-col gap-4.5">
          <input type="hidden" name="phone" value={phone} />
          <Input name="code" label={t.otpCodeLabel} dir="ltr" className="text-right" inputMode="numeric" required />
          <button
            type="button"
            onClick={handleResend}
            disabled={secondsLeft > 0 || isResending}
            className="w-fit self-center text-xs text-brand disabled:text-text-3"
          >
            {secondsLeft > 0 ? resendCountdownLabel(lang, secondsLeft) : t.resendCode}
          </button>
          {resendError && <p className="text-center text-xs text-red-500">{resendError}</p>}
          {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
          <Button variant="primary" type="submit" disabled={pending} className="w-full">
            {pending ? t.verifying : t.loginToAccount}
          </Button>
        </form>
      </div>
    </div>
  );
}
