import "server-only";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { logger } from "@/lib/logger";
import * as userRepo from "@/features/auth/repositories/user-repository";
import * as dashboardRepo from "@/features/dashboard/repositories/dashboard-repository";
import { staffUserSchema } from "@/features/dashboard/services/dashboard-schemas";

export type ServiceResult = { ok: true } | { ok: false; error: string };
export type CreateStaffUserResult = { ok: true; tempPassword: string } | { ok: false; error: string };

export function getUsers(businessId: string) {
  return userRepo.getUsersForBusiness(businessId);
}

function generateTempPassword(): string {
  return crypto.randomBytes(6).toString("base64url").slice(0, 8);
}

export async function createStaffUser(businessId: string, input: unknown): Promise<CreateStaffUserResult> {
  const parsed = staffUserSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const business = await dashboardRepo.getBusinessById(businessId);
  if (!business) return { ok: false, error: "کسب‌وکار پیدا نشد." };

  const currentCount = await userRepo.countUsersForBusiness(businessId);
  if (currentCount >= business.planMaxUsers) {
    return {
      ok: false,
      error: `سقف ${business.planMaxUsers.toLocaleString("fa-IR")} کاربر برای پلن فعلی شما پر شده است.`,
    };
  }

  const existing = await userRepo.findUserByPhone(parsed.data.phone);
  if (existing) return { ok: false, error: "کاربری با این شماره قبلاً ثبت شده است." };

  const tempPassword = generateTempPassword();
  const passwordHash = await bcrypt.hash(tempPassword, 10);
  await userRepo.createStaffUser({
    phone: parsed.data.phone,
    fullName: parsed.data.fullName,
    role: parsed.data.role,
    passwordHash,
    businessId,
  });
  logger.info("dashboard.staff_user_created", { businessId, role: parsed.data.role });
  return { ok: true, tempPassword };
}

export async function updateStaffUser(
  businessId: string,
  userId: string,
  input: unknown
): Promise<ServiceResult> {
  const existing = await userRepo.getUserById(userId);
  if (!existing || existing.businessId !== businessId) return { ok: false, error: "کاربر پیدا نشد." };

  const parsed = staffUserSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  if (parsed.data.phone !== existing.phone) {
    const duplicate = await userRepo.findUserByPhone(parsed.data.phone);
    if (duplicate) return { ok: false, error: "کاربری با این شماره قبلاً ثبت شده است." };
  }

  await userRepo.updateUser(userId, parsed.data);
  logger.info("dashboard.staff_user_updated", { businessId, userId });
  return { ok: true };
}
