"use server";

import { redirect } from "next/navigation";
import * as customerAuthService from "@/features/customer/services/customer-auth-service";
import * as addressService from "@/features/customer/services/address-service";
import * as repo from "@/features/customer/repositories/customer-repository";
import { updateProfileSchema } from "@/features/customer/services/customer-schemas";
import { requireCustomerSession, clearCustomerSession } from "@/features/customer/services/customer-session-service";
import { resolvePostLoginPath } from "@/features/customer/services/next-path";

export interface ActionState {
  error?: string;
  ok?: boolean;
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

export async function sendCustomerOtpAction(
  slug: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const phone = String(formData.get("phone") ?? "");
  const result = await customerAuthService.sendOtp({ slug, phone });
  if (!result.ok) return { error: result.error };

  const next = String(formData.get("next") ?? "");
  const params = new URLSearchParams({ phone });
  if (next) params.set("next", next);
  redirect(`/${slug}/account/verify?${params.toString()}`);
}

export async function resendCustomerOtpAction(slug: string, phone: string) {
  return customerAuthService.sendOtp({ slug, phone });
}

export async function verifyCustomerOtpAction(
  slug: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const result = await customerAuthService.verifyOtp({
    slug,
    phone: String(formData.get("phone") ?? ""),
    code: String(formData.get("code") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  redirect(resolvePostLoginPath(slug, String(formData.get("next") ?? "")));
}

export async function customerLogoutAction(slug: string) {
  await clearCustomerSession();
  redirect(`/${slug}`);
}

export async function updateCustomerProfileAction(
  slug: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { customerAccountId } = await requireCustomerSession(slug);
  const parsed = updateProfileSchema.safeParse({
    fullName: String(formData.get("fullName") ?? ""),
    birthDate: String(formData.get("birthDate") ?? ""),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await repo.updateAccountProfile(customerAccountId, {
    fullName: parsed.data.fullName,
    birthDate: parsed.data.birthDate ? new Date(parsed.data.birthDate) : undefined,
  });
  return { ok: true };
}

export async function createCustomerAddressAction(
  slug: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { customerAccountId } = await requireCustomerSession(slug);
  const result = await addressService.createAddress(customerAccountId, {
    title: String(formData.get("title") ?? ""),
    text: String(formData.get("text") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    isDefault: bool(formData, "isDefault"),
  });
  if (!result.ok) return { error: result.error };
  return { ok: true };
}

export async function updateCustomerAddressAction(
  slug: string,
  addressId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { customerAccountId } = await requireCustomerSession(slug);
  const result = await addressService.updateAddress(customerAccountId, addressId, {
    title: String(formData.get("title") ?? ""),
    text: String(formData.get("text") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    isDefault: bool(formData, "isDefault"),
  });
  if (!result.ok) return { error: result.error };
  return { ok: true };
}

export async function deleteCustomerAddressAction(slug: string, addressId: string) {
  const { customerAccountId } = await requireCustomerSession(slug);
  return addressService.deleteAddress(customerAccountId, addressId);
}

export async function setDefaultCustomerAddressAction(slug: string, addressId: string) {
  const { customerAccountId } = await requireCustomerSession(slug);
  return addressService.setDefaultAddress(customerAccountId, addressId);
}
