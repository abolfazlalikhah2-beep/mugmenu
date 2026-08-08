"use client";

import { useActionState } from "react";
import { UserRound, KeyRound } from "lucide-react";
import { AuthShell, AuthHeader } from "@/components/auth/auth-shell";
import { AuthFooterLink, AuthFooterRow } from "@/components/auth/auth-footer-link";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { loginAction, type AuthActionState } from "@/features/auth/routes/actions";

const initialState: AuthActionState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <AuthShell
      footer={
        <AuthFooterRow>
          <AuthFooterLink
            icon={UserRound}
            prompt="حساب کاربری ندارید؟"
            linkLabel="ثبت‌نام کنید"
            href="/register"
          />
          <AuthFooterLink icon={KeyRound} linkLabel="فراموشی رمز عبور" href="/forgot-password" />
        </AuthFooterRow>
      }
    >
      <AuthHeader title="ورود به سیستم" eyebrow="LOGIN" />
      <form action={formAction} className="flex flex-col gap-5">
        <Input
          name="phone"
          label="شماره تلفن همراه خود را وارد کنید"
          dir="ltr"
          className="text-right"
          inputMode="numeric"
          required
        />
        <PasswordInput name="password" label="رمز عبور شما" required />
        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
        <Button variant="primary" type="submit" disabled={pending} className="mt-2 w-full">
          {pending ? "در حال ورود…" : "ورود"}
        </Button>
      </form>
    </AuthShell>
  );
}
