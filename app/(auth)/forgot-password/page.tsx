"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { AuthShell, AuthHeader } from "@/components/auth/auth-shell";
import { AuthFooterLink, AuthFooterRow } from "@/components/auth/auth-footer-link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forgotPasswordAction, type AuthActionState } from "@/features/auth/routes/actions";

const initialState: AuthActionState = {};

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, initialState);

  return (
    <AuthShell
      footer={
        <AuthFooterRow>
          <AuthFooterLink icon={LogIn} prompt="حساب کاربری دارید؟" linkLabel="وارد شوید" href="/login" />
        </AuthFooterRow>
      }
    >
      <AuthHeader title="فراموشی رمز عبور" eyebrow="FORGOT PASSWORD" />
      <form action={formAction} className="flex flex-col gap-5">
        <Input
          name="phone"
          label="شماره تلفن همراه خود را وارد کنید"
          dir="ltr"
          className="text-right"
          inputMode="numeric"
          required
        />
        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
        <Button variant="primary" type="submit" disabled={pending} className="mt-2 w-full">
          {pending ? "در حال ارسال…" : "ارسال کد تایید"}
        </Button>
      </form>
    </AuthShell>
  );
}
