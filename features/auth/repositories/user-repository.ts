import "server-only";
import { prisma } from "@/lib/db";

export function findUserByPhone(phone: string) {
  return prisma.user.findUnique({ where: { phone } });
}

export function createUser(data: { phone: string; fullName: string; passwordHash: string }) {
  return prisma.user.create({ data });
}

export function updatePasswordByPhone(phone: string, passwordHash: string) {
  return prisma.user.update({ where: { phone }, data: { passwordHash } });
}
