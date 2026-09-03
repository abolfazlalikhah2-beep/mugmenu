import "server-only";
import { prisma } from "@/lib/db";

export function createLeadCapture(data: { phone: string; source?: string }) {
  return prisma.leadCapture.create({ data });
}

export function getLeadCaptures() {
  return prisma.leadCapture.findMany({ orderBy: { createdAt: "desc" } });
}

export function markLeadCaptureRead(id: string, isRead: boolean) {
  return prisma.leadCapture.update({ where: { id }, data: { isRead } });
}
