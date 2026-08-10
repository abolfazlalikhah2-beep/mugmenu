import "server-only";
import { logger } from "@/lib/logger";
import * as repo from "@/features/customer/repositories/customer-repository";
import { addressSchema } from "@/features/customer/services/customer-schemas";

export type ServiceResult = { ok: true } | { ok: false; error: string };

export function getAddresses(customerAccountId: string) {
  return repo.getAddresses(customerAccountId);
}

export async function createAddress(customerAccountId: string, input: unknown): Promise<ServiceResult> {
  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const existingCount = await repo.countAddresses(customerAccountId);
  await repo.createAddress({ customerAccountId, ...parsed.data, isDefault: parsed.data.isDefault || existingCount === 0 });
  logger.info("customer.address_created", { customerAccountId });
  return { ok: true };
}

export async function updateAddress(
  customerAccountId: string,
  addressId: string,
  input: unknown
): Promise<ServiceResult> {
  const existing = await repo.getAddressById(addressId);
  if (!existing || existing.customerAccountId !== customerAccountId) return { ok: false, error: "آدرس پیدا نشد." };

  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await repo.updateAddress(addressId, parsed.data);
  logger.info("customer.address_updated", { customerAccountId, addressId });
  return { ok: true };
}

export async function deleteAddress(customerAccountId: string, addressId: string): Promise<ServiceResult> {
  const existing = await repo.getAddressById(addressId);
  if (!existing || existing.customerAccountId !== customerAccountId) return { ok: false, error: "آدرس پیدا نشد." };

  await repo.deleteAddress(addressId);
  logger.info("customer.address_deleted", { customerAccountId, addressId });
  return { ok: true };
}

export async function setDefaultAddress(customerAccountId: string, addressId: string): Promise<ServiceResult> {
  const existing = await repo.getAddressById(addressId);
  if (!existing || existing.customerAccountId !== customerAccountId) return { ok: false, error: "آدرس پیدا نشد." };

  await repo.setAddressDefault(addressId, customerAccountId);
  logger.info("customer.address_default_set", { customerAccountId, addressId });
  return { ok: true };
}
