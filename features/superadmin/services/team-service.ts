import "server-only";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { logger } from "@/lib/logger";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
import * as repo from "@/features/superadmin/repositories/superadmin-repository";
import { teamUserSchema } from "@/features/superadmin/services/superadmin-schemas";

export type ServiceResult = { ok: true } | { ok: false; error: string };
export type CreateTeamMemberResult = { ok: true; tempPassword: string } | { ok: false; error: string };

export function getTeamUsers() {
  return repo.getTeamUsers();
}

function generateTempPassword(): string {
  return crypto.randomBytes(6).toString("base64url").slice(0, 8);
}

export async function createTeamMember(input: unknown): Promise<CreateTeamMemberResult> {
  const parsed = teamUserSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const existing = await findUserByPhone(parsed.data.phone);
  if (existing) return { ok: false, error: "کاربری با این شماره قبلاً ثبت شده است." };

  const tempPassword = generateTempPassword();
  const passwordHash = await bcrypt.hash(tempPassword, 10);
  await repo.createTeamUser({
    phone: parsed.data.phone,
    fullName: parsed.data.fullName,
    passwordHash,
    platformRole: parsed.data.platformRole,
    platformTeam: parsed.data.platformTeam,
  });
  logger.info("superadmin.team_member_created", { platformRole: parsed.data.platformRole });
  return { ok: true, tempPassword };
}

export async function updateTeamMember(userId: string, input: unknown): Promise<ServiceResult> {
  const existing = await repo.getTeamUserById(userId);
  if (!existing || !existing.isSuperAdmin) return { ok: false, error: "کاربر پیدا نشد." };

  const parsed = teamUserSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  if (parsed.data.phone !== existing.phone) {
    const duplicate = await findUserByPhone(parsed.data.phone);
    if (duplicate) return { ok: false, error: "کاربری با این شماره قبلاً ثبت شده است." };
  }

  await repo.updateTeamUser(userId, parsed.data);
  logger.info("superadmin.team_member_updated", { userId });
  return { ok: true };
}

export async function setTeamMemberActive(userId: string, isActive: boolean): Promise<ServiceResult> {
  const existing = await repo.getTeamUserById(userId);
  if (!existing || !existing.isSuperAdmin) return { ok: false, error: "کاربر پیدا نشد." };

  await repo.setTeamUserActive(userId, isActive);
  logger.info("superadmin.team_member_active_toggled", { userId, isActive });
  return { ok: true };
}
