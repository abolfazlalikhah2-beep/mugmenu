"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { AuthShell, AuthHeader } from "@/components/auth/auth-shell";
import { AuthFooterLink, AuthFooterRow } from "@/components/auth/auth-footer-link";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { changePasswordAction, type AuthActionState } from "@/features/auth/routes/actions";

const initialState: AuthActionState = {};

export function ChangePasswordForm({ phone }: { phone?: string }) {
  const [state, formAction, pending] = useActionState(changePasswordAction, initialState);

  return (
    <AuthShell
      footer={
        <AuthFooterRow>
          <AuthFooterLink icon={LogIn} prompt="حساب کاربری دارید؟" linkLabel="وارد شوید" href="/login" />
        </AuthFooterRow>
      }
    >
      <AuthHeader title="تغییر رمز عبور" eyebrow="CHANGE PASSWORD" />
      <form action={formAction} className="flex flex-col gap-5">
        {phone && <input type="hidden" name="phone" value={phone} />}
        <PasswordInput name="password" label="رمز عبور شما" required />
        <PasswordInput name="confirmPassword" label="تکرار رمز عبور" required />
        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
        <Button variant="primary" type="submit" disabled={pending} className="mt-2 w-full">
          {pending ? "در حال ثبت…" : "تایید اطلاعات"}
        </Button>
      </form>
    </AuthShell>
  );
}
