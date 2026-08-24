"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin, requireOwnerRole } from "@/features/auth/services/authorize";
import * as paymentService from "@/features/payments/services/payment-service";

export interface ActionState {
  error?: string;
  ok?: boolean;
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

// ---------- Super admin: payment cards ----------

export async function createPaymentCardAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireSuperAdmin();
  const result = await paymentService.createCard({
    holderName: String(formData.get("holderName") ?? ""),
    bankName: String(formData.get("bankName") ?? ""),
    cardNumber: String(formData.get("cardNumber") ?? ""),
    accountNumber: String(formData.get("accountNumber") ?? ""),
    isActive: bool(formData, "isActive"),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/superadmin/payment-cards");
  return { ok: true };
}

export async function updatePaymentCardAction(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireSuperAdmin();
  const result = await paymentService.updateCard(id, {
    holderName: String(formData.get("holderName") ?? ""),
    bankName: String(formData.get("bankName") ?? ""),
    cardNumber: String(formData.get("cardNumber") ?? ""),
    accountNumber: String(formData.get("accountNumber") ?? ""),
    isActive: bool(formData, "isActive"),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/superadmin/payment-cards");
  return { ok: true };
}

export async function togglePaymentCardActiveAction(id: string, next: boolean) {
  await requireSuperAdmin();
  const result = await paymentService.toggleCardActive(id, next);
  revalidatePath("/superadmin/payment-cards");
  return result;
}

export async function deletePaymentCardAction(id: string) {
  await requireSuperAdmin();
  const result = await paymentService.deleteCard(id);
  revalidatePath("/superadmin/payment-cards");
  return result;
}

// ---------- Super admin: payment requests ----------

export async function verifyPaymentRequestAction(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireSuperAdmin();
  const result = await paymentService.verifyRequest(id, {
    referenceNumber: String(formData.get("referenceNumber") ?? ""),
    status: String(formData.get("status") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    newPlanId: String(formData.get("newPlanId") ?? "") || undefined,
    billingCycle: String(formData.get("billingCycle") ?? "") || undefined,
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/superadmin/payment-requests");
  revalidatePath(`/superadmin/customers/${result.businessId}`);
  return { ok: true };
}

// ---------- Business owner: payment requests ----------

export async function createPaymentRequestAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireOwnerRole();
  const result = await paymentService.createRequest(businessId, {
    amount: String(formData.get("amount") ?? ""),
    assignedCardId: String(formData.get("assignedCardId") ?? ""),
    referenceNumber: String(formData.get("referenceNumber") ?? ""),
    screenshotUrl: String(formData.get("screenshotUrl") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/payment");
  revalidatePath("/dashboard/account");
  return { ok: true };
}
