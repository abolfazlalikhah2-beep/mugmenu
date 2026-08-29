import "server-only";
import { prisma } from "@/lib/db";

export function getSetting(key: string) {
  return prisma.siteSetting.findUnique({ where: { key } });
}

export function getAllSettings() {
  return prisma.siteSetting.findMany();
}

export function setSetting(key: string, value: string) {
  return prisma.siteSetting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}
