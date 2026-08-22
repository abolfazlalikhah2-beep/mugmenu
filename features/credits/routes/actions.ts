"use server";

import { revalidatePath } from "next/cache";
import { requireBusinessOwner } from "@/features/auth/services/authorize";
import * as creditService from "@/features/credits/services/credit-service";

export interface ActionState {
  error?: string;
  ok?: boolean;
}

export async function settleCreditRecordAction(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await creditService.settleCreditRecord(businessId, id, {
    receivedAmount: String(formData.get("receivedAmount") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/credits");
  return { ok: true };
}
