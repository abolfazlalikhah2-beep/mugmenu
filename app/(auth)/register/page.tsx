"use client";

import { useActionState } from "react";
import { LogIn, KeyRound } from "lucide-react";
import { AuthShell, AuthHeader } from "@/components/auth/auth-shell";
import { AuthFooterLink, AuthFooterRow } from "@/components/auth/auth-footer-link";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { registerAction, type AuthActionState } from "@/features/auth/routes/actions";

const initialState: AuthActionState = {};

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <AuthShell
      footer={
        <AuthFooterRow>
          <AuthFooterLink icon={LogIn} prompt="حساب کاربری دارید؟" linkLabel="وارد شوید" href="/login" />
          <AuthFooterLink icon={KeyRound} linkLabel="فراموشی رمز عبور" href="/forgot-password" />
        </AuthFooterRow>
      }
    >
      <AuthHeader title="ثبت نام" eyebrow="REGISTER" />
      <form action={formAction} className="flex flex-col gap-5">
        <Input name="fullName" label="نام و نام خانوادگی" required />
        <Input
          name="phone"
          label="شماره تلفن همراه خود را وارد کنید"
          dir="ltr"
          className="text-right"
          inputMode="numeric"
          required
        />
        <PasswordInput name="password" label="رمز عبور شما" required />
        <PasswordInput name="confirmPassword" label="تکرار رمز عبور" required />
        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
        <Button variant="primary" type="submit" disabled={pending} className="mt-2 w-full">
          {pending ? "در حال ثبت‌نام…" : "ثبت نام"}
        </Button>
      </form>
    </AuthShell>
  );
}
