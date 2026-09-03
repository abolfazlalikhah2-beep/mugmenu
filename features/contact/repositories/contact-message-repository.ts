import "server-only";
import { prisma } from "@/lib/db";

export function createContactMessage(data: { name: string; phone: string; email?: string; message: string }) {
  return prisma.contactMessage.create({ data });
}

export function getContactMessages() {
  return prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
}

export function markContactMessageRead(id: string, isRead: boolean) {
  return prisma.contactMessage.update({ where: { id }, data: { isRead } });
}
