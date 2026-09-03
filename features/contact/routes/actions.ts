"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/features/auth/services/authorize";
import * as contactService from "@/features/contact/services/contact-service";

export interface ContactActionState {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

function formValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function submitContactMessageAction(
  _prevState: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  const result = await contactService.submitContactMessage({
    name: formValue(formData, "name"),
    phone: formValue(formData, "phone"),
    email: formValue(formData, "email"),
    message: formValue(formData, "message"),
  });
  if (!result.ok) return { ok: false, error: result.error, fieldErrors: result.fieldErrors };
  return { ok: true };
}

export async function markContactMessageReadAction(id: string, isRead: boolean) {
  await requireSuperAdmin();
  await contactService.setContactMessageRead(id, isRead);
  revalidatePath("/superadmin/contacts");
  return { ok: true };
}
