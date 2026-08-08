import "server-only";
import { prisma } from "@/lib/db";
import type { UserRole } from "@/lib/generated/prisma/enums";

export function findUserByPhone(phone: string) {
  return prisma.user.findUnique({ where: { phone } });
}

export function createUser(data: { phone: string; fullName: string; passwordHash: string }) {
  return prisma.user.create({ data });
}

export function updatePasswordByPhone(phone: string, passwordHash: string) {
  return prisma.user.update({ where: { phone }, data: { passwordHash } });
}

// ---------- Staff management (owner adding/editing team members) ----------

export function getUsersForBusiness(businessId: string) {
  return prisma.user.findMany({ where: { businessId }, orderBy: { createdAt: "asc" } });
}

export function countUsersForBusiness(businessId: string) {
  return prisma.user.count({ where: { businessId } });
}

export function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export function createStaffUser(data: {
  phone: string;
  fullName: string;
  passwordHash: string;
  role: UserRole;
  businessId: string;
}) {
  return prisma.user.create({ data });
}

export function updateUser(id: string, data: { fullName?: string; phone?: string; role?: UserRole }) {
  return prisma.user.update({ where: { id }, data });
}
