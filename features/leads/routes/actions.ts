"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/features/auth/services/authorize";
import * as leadService from "@/features/leads/services/lead-service";

export async function markLeadCaptureReadAction(id: string, isRead: boolean) {
  await requireSuperAdmin();
  await leadService.setLeadCaptureRead(id, isRead);
  revalidatePath("/superadmin/leads");
  return { ok: true };
}
