"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/features/auth/services/authorize";
import * as financeService from "@/features/superadmin/services/finance-service";
import * as customerService from "@/features/superadmin/services/customer-service";
import * as teamService from "@/features/superadmin/services/team-service";
import * as ticketService from "@/features/superadmin/services/ticket-service";

export interface ActionState {
  error?: string;
  ok?: boolean;
  tempPassword?: string;
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

export async function updateGatewaySettingsAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireSuperAdmin();
  const result = await financeService.updateGatewaySettings({
    zarinpalMerchantId: String(formData.get("zarinpalMerchantId") ?? ""),
    zarinpalApiKey: String(formData.get("zarinpalApiKey") ?? ""),
    zarinpalCallbackUrl: String(formData.get("zarinpalCallbackUrl") ?? ""),
    zarinpalSandbox: bool(formData, "zarinpalSandbox"),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/superadmin/finance");
  return { ok: true };
}

export async function toggleGatewayEnabledAction(next: boolean) {
  await requireSuperAdmin();
  const result = await financeService.toggleGatewayEnabled(next);
  revalidatePath("/superadmin/finance");
  return result;
}

export async function renewSubscriptionAction(businessId: string) {
  await requireSuperAdmin();
  const result = await customerService.renewSubscription(businessId);
  revalidatePath(`/superadmin/customers/${businessId}`);
  revalidatePath("/superadmin/customers");
  return result;
}

export async function toggleSuspendBusinessAction(businessId: string, next: boolean) {
  await requireSuperAdmin();
  const result = await customerService.setSuspended(businessId, next);
  revalidatePath(`/superadmin/customers/${businessId}`);
  revalidatePath("/superadmin/customers");
  return result;
}

export async function changePlanAction(businessId: string, planId: string, billingCycle: string) {
  await requireSuperAdmin();
  const result = await customerService.changePlan(businessId, { planId, billingCycle });
  revalidatePath(`/superadmin/customers/${businessId}`);
  revalidatePath("/superadmin/customers");
  return result;
}

export async function updateBusinessDemoAction(
  businessId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireSuperAdmin();
  const result = await customerService.updateDemo(businessId, {
    isDemoActive: bool(formData, "isDemoActive"),
    demoExpiresAt: String(formData.get("demoExpiresAt") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath(`/superadmin/customers/${businessId}`);
  revalidatePath("/superadmin/customers");
  return { ok: true };
}

export async function createTeamMemberAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireSuperAdmin();
  const result = await teamService.createTeamMember({
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    platformRole: String(formData.get("platformRole") ?? ""),
    platformTeam: String(formData.get("platformTeam") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/superadmin/users");
  return { ok: true, tempPassword: result.tempPassword };
}

export async function updateTeamMemberAction(
  userId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireSuperAdmin();
  const result = await teamService.updateTeamMember(userId, {
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    platformRole: String(formData.get("platformRole") ?? ""),
    platformTeam: String(formData.get("platformTeam") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/superadmin/users");
  return { ok: true };
}

export async function toggleTeamMemberActiveAction(userId: string, next: boolean) {
  await requireSuperAdmin();
  const result = await teamService.setTeamMemberActive(userId, next);
  revalidatePath("/superadmin/users");
  return result;
}

export async function addAgentReplyAction(
  ticketId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { session } = await requireSuperAdmin();
  const result = await ticketService.addAgentReply(session, ticketId, {
    text: String(formData.get("text") ?? ""),
    attachmentUrl: String(formData.get("attachmentUrl") ?? ""),
    attachmentName: String(formData.get("attachmentName") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath(`/superadmin/tickets/${ticketId}`);
  return { ok: true };
}

export async function createTicketForCustomerAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { session } = await requireSuperAdmin();
  const result = await ticketService.createTicketForCustomer(session, {
    businessId: String(formData.get("businessId") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    category: String(formData.get("category") ?? ""),
    priority: String(formData.get("priority") ?? ""),
    text: String(formData.get("text") ?? ""),
    notifySms: bool(formData, "notifySms"),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/superadmin/tickets");
  redirect(`/superadmin/tickets/${result.ticketId}`);
}
