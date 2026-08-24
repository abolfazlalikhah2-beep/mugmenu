import "server-only";
import { prisma } from "@/lib/db";
import type { OtpPurpose } from "@/lib/generated/prisma/enums";

export function createOtp(data: { phone: string; purpose: OtpPurpose; codeHash: string; expiresAt: Date }) {
  return prisma.otpCode.create({ data });
}

export function findLatestActiveOtp(phone: string, purpose: OtpPurpose) {
  return prisma.otpCode.findFirst({
    where: { phone, purpose, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });
}

export function consumeOtp(id: string) {
  return prisma.otpCode.update({ where: { id }, data: { consumedAt: new Date() } });
}
