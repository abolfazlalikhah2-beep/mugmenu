"use server";

import { redirect } from "next/navigation";
import * as authService from "@/features/auth/services/auth-service";
import { sendOtp, OtpRateLimitError } from "@/features/auth/services/otp-service";
import { clearSession } from "@/features/auth/services/session-service";

export interface AuthActionState {
  error?: string;
}

function formValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const result = await authService.login({
    phone: formValue(formData, "phone"),
    password: String(formData.get("password") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  redirect("/");
}

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const phone = formValue(formData, "phone");
  const result = await authService.register({
    phone,
    fullName: formValue(formData, "fullName"),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  redirect(`/verify?phone=${encodeURIComponent(phone)}&purpose=register`);
}

export async function forgotPasswordAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const phone = formValue(formData, "phone");
  const result = await authService.forgotPassword({ phone });
  if (!result.ok) return { error: result.error };
  redirect(`/verify?phone=${encodeURIComponent(phone)}&purpose=reset`);
}

export async function resendOtpAction(phone: string) {
  try {
    await sendOtp(phone);
  } catch (e) {
    if (e instanceof OtpRateLimitError) return { error: e.message };
    throw e;
  }
  return { error: undefined };
}

export async function verifyOtpAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const phone = formValue(formData, "phone");
  const purpose = formValue(formData, "purpose");
  const result = await authService.verifyOtp({ phone, purpose, code: formValue(formData, "code") });
  if (!result.ok) return { error: result.error };
  if (result.purpose === "reset") {
    redirect(`/change-password?phone=${encodeURIComponent(phone)}`);
  }
  redirect("/");
}

export async function changePasswordAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const result = await authService.changePassword({
    phone: formValue(formData, "phone"),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  redirect("/login");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
