"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { LogIn, Pencil } from "lucide-react";
import { AuthShell, AuthHeader } from "@/components/auth/auth-shell";
import { AuthFooterLink, AuthFooterRow } from "@/components/auth/auth-footer-link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { verifyOtpAction, resendOtpAction, type AuthActionState } from "@/features/auth/routes/actions";

const initialState: AuthActionState = {};
const RESEND_SECONDS = 120;

export function VerifyForm({
  phone,
  purpose,
}: {
  phone: string;
  purpose: "register" | "reset";
}) {
  const [state, formAction, pending] = useActionState(verifyOtpAction, initialState);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [isResending, startResend] = useTransition();
  const [resendError, setResendError] = useState<string | null>(null);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  function handleResend() {
    startResend(async () => {
      const result = await resendOtpAction(phone, purpose);
      if (result.error) {
        setResendError(result.error);
        return;
      }
      setResendError(null);
      setSecondsLeft(RESEND_SECONDS);
    });
  }

  return (
    <AuthShell
      footer={
        <AuthFooterRow>
          <AuthFooterLink icon={LogIn} prompt="حساب کاربری دارید؟" linkLabel="وارد شوید" href="/login" />
          <AuthFooterLink
            icon={Pencil}
            linkLabel="اصلاح شماره تماس"
            href={purpose === "reset" ? "/forgot-password" : "/register"}
          />
        </AuthFooterRow>
      }
    >
      <AuthHeader
        title="بررسی کد تایید"
        eyebrow="VERIFICATION CODE"
        description={
          <div className="mt-1 flex flex-col gap-1 text-xs text-text-2">
            <span>
              ارسال کد فعال‌سازی به شماره{" "}
              <span className="font-mont" dir="ltr">
                {phone}
              </span>
            </span>
            <button
              type="button"
              onClick={handleResend}
              disabled={secondsLeft > 0 || isResending}
              className="w-fit text-brand disabled:text-text-3"
            >
              {secondsLeft > 0
                ? `ارسال مجدد کد تایید (${secondsLeft})`
                : "ارسال مجدد کد تایید"}
            </button>
            {resendError && <span className="text-red-500">{resendError}</span>}
          </div>
        }
      />
      <form action={formAction} className="flex flex-col gap-5">
        <input type="hidden" name="phone" value={phone} />
        <input type="hidden" name="purpose" value={purpose} />
        <Input
          name="code"
          label="کد تایید را وارد کنید"
          dir="ltr"
          className="text-right"
          inputMode="numeric"
          required
        />
        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
        <Button variant="primary" type="submit" disabled={pending} className="mt-2 w-full">
          {pending ? "در حال بررسی…" : "تایید"}
        </Button>
      </form>
    </AuthShell>
  );
}
