import "server-only";
import { prisma } from "@/lib/db";

export function createContactMessage(data: { name: string; phone: string; email?: string; message: string }) {
  return prisma.contactMessage.create({ data });
}
