"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession, requireBusinessOwner, requireOwnerRole } from "@/features/auth/services/authorize";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";
import * as onboardingService from "@/features/dashboard/services/onboarding-service";
import * as settingsService from "@/features/dashboard/services/settings-service";
import * as orderMgmtService from "@/features/dashboard/services/order-mgmt-service";
import * as printerService from "@/features/dashboard/services/printer-service";
import * as smsSettingsService from "@/features/dashboard/services/sms-settings-service";
import * as contactService from "@/features/dashboard/services/contact-service";
import * as smsService from "@/features/dashboard/services/sms-service";
import * as loyaltyClubService from "@/features/dashboard/services/loyalty-club-service";
import * as supportService from "@/features/dashboard/services/support-service";
import * as productService from "@/features/dashboard/services/product-service";
import * as categoryService from "@/features/dashboard/services/category-service";
import * as discountService from "@/features/dashboard/services/discount-service";
import * as userMgmtService from "@/features/dashboard/services/user-mgmt-service";

export interface ActionState {
  error?: string;
  ok?: boolean;
  tempPassword?: string;
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

export async function onboardingAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireSession();
  const user = await findUserByPhone(session.phone);
  if (!user) return { error: "کاربر پیدا نشد." };

  const result = await onboardingService.completeOnboarding(user.id, {
    name: String(formData.get("name") ?? ""),
    nameEn: String(formData.get("nameEn") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    address: String(formData.get("address") ?? ""),
    description: String(formData.get("description") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  redirect("/dashboard");
}

export async function toggleAcceptingOrdersAction(isAcceptingOrders: boolean) {
  const { businessId } = await requireBusinessOwner();
  const result = await settingsService.toggleAcceptingOrders(businessId, isAcceptingOrders);
  revalidatePath("/dashboard");
  return result;
}

export async function updateBusinessInfoAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await settingsService.updateBusinessInfo(businessId, {
    name: String(formData.get("name") ?? ""),
    nameEn: String(formData.get("nameEn") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    address: String(formData.get("address") ?? ""),
    openingHoursStart: String(formData.get("openingHoursStart") ?? ""),
    openingHoursEnd: String(formData.get("openingHoursEnd") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/settings");
  return { ok: true };
}

export async function updateOrderSettingsAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await settingsService.updateOrderSettings(businessId, {
    acceptsDineIn: bool(formData, "acceptsDineIn"),
    acceptsTakeaway: bool(formData, "acceptsTakeaway"),
    acceptsDelivery: bool(formData, "acceptsDelivery"),
    prepTimeDineIn: String(formData.get("prepTimeDineIn") ?? ""),
    prepTimeTakeaway: String(formData.get("prepTimeTakeaway") ?? ""),
    prepTimeDelivery: String(formData.get("prepTimeDelivery") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/settings");
  return { ok: true };
}

export async function updateQrSettingsAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await settingsService.updateQrSettings(businessId, {
    qrShowInfo: bool(formData, "qrShowInfo"),
    qrShowHours: bool(formData, "qrShowHours"),
    qrShowLogo: bool(formData, "qrShowLogo"),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/settings");
  return { ok: true };
}

export async function updatePaymentSettingsAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await settingsService.updatePaymentSettings(businessId, {
    acceptsOnlinePayment: bool(formData, "acceptsOnlinePayment"),
    acceptsCashPayment: bool(formData, "acceptsCashPayment"),
    packagingFee: String(formData.get("packagingFee") ?? ""),
    serviceFeePercent: String(formData.get("serviceFeePercent") ?? "0"),
    taxPercent: String(formData.get("taxPercent") ?? "0"),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/settings");
  return { ok: true };
}

export async function updateMenuAppearanceAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await settingsService.updateMenuAppearance(businessId, {
    accentColor: String(formData.get("accentColor") ?? ""),
    logoUrl: String(formData.get("logoUrl") ?? ""),
    heroBgKey: String(formData.get("heroBgKey") ?? ""),
    heroImageUrl: String(formData.get("heroImageUrl") ?? ""),
    heroOverlayOpacity: String(formData.get("heroOverlayOpacity") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/settings");
  return { ok: true };
}

export async function updateLanguageSettingsAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await settingsService.updateLanguageSettings(businessId, {
    bilingualMenuEnabled: bool(formData, "bilingualMenuEnabled"),
    askLanguageOnEntry: bool(formData, "askLanguageOnEntry"),
    rememberCustomerLanguage: bool(formData, "rememberCustomerLanguage"),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/settings");
  return { ok: true };
}

export async function updateProductTranslationsAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();

  let rows: { productId: string; nameEn?: string; descriptionEn?: string }[] = [];
  try {
    rows = JSON.parse(String(formData.get("translations") ?? "[]"));
  } catch {
    rows = [];
  }

  for (const row of rows) {
    const result = await productService.updateProductTranslation(businessId, row.productId, {
      nameEn: row.nameEn ?? "",
      descriptionEn: row.descriptionEn ?? "",
    });
    if (!result.ok) return { error: result.error };
  }
  revalidatePath("/dashboard/settings");
  return { ok: true };
}

export async function createPrinterAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await printerService.createPrinter(businessId, {
    name: String(formData.get("name") ?? ""),
    model: String(formData.get("model") ?? ""),
    connectionType: String(formData.get("connectionType") ?? ""),
    ipAddress: String(formData.get("ipAddress") ?? ""),
    port: String(formData.get("port") ?? ""),
    paperSize: String(formData.get("paperSize") ?? ""),
    copies: String(formData.get("copies") ?? "1"),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/settings");
  return { ok: true };
}

export async function updatePrinterAction(
  printerId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await printerService.updatePrinter(businessId, printerId, {
    name: String(formData.get("name") ?? ""),
    model: String(formData.get("model") ?? ""),
    connectionType: String(formData.get("connectionType") ?? ""),
    ipAddress: String(formData.get("ipAddress") ?? ""),
    port: String(formData.get("port") ?? ""),
    paperSize: String(formData.get("paperSize") ?? ""),
    copies: String(formData.get("copies") ?? "1"),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/settings");
  return { ok: true };
}

export async function testPrinterAction(printerId: string) {
  const { businessId } = await requireBusinessOwner();
  const result = await printerService.testPrinter(businessId, printerId);
  revalidatePath("/dashboard/settings");
  return result;
}

export async function updateSmsSettingsAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await smsSettingsService.updateSmsSettings(businessId, {
    smsProvider: String(formData.get("smsProvider") ?? ""),
    smsUsername: String(formData.get("smsUsername") ?? ""),
    smsApiKey: String(formData.get("smsApiKey") ?? ""),
    smsSenderNumber: String(formData.get("smsSenderNumber") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/messages");
  return { ok: true };
}

export async function createContactAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await contactService.createContact(businessId, {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/messages");
  return { ok: true };
}

export async function deleteContactAction(contactId: string) {
  const { businessId } = await requireBusinessOwner();
  const result = await contactService.deleteContact(businessId, contactId);
  revalidatePath("/dashboard/messages");
  return result;
}

export interface SendSmsActionState extends ActionState {
  sent?: number;
  failed?: number;
}

export async function sendSingleSmsAction(
  _prevState: SendSmsActionState,
  formData: FormData
): Promise<SendSmsActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await smsService.sendSingleSms(businessId, {
    phone: String(formData.get("phone") ?? ""),
    text: String(formData.get("text") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/messages");
  return { ok: true, sent: result.sent, failed: result.failed };
}

export async function sendBulkSmsAction(
  _prevState: SendSmsActionState,
  formData: FormData
): Promise<SendSmsActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await smsService.sendBulkSms(businessId, {
    audience: String(formData.get("audience") ?? ""),
    manualContactIds: formData.getAll("manualContactIds").map(String),
    loyaltyFilter: String(formData.get("loyaltyFilter") ?? "ALL"),
    text: String(formData.get("text") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/messages");
  revalidatePath("/dashboard/customers");
  return { ok: true, sent: result.sent, failed: result.failed };
}

export async function updateCashbackSettingsAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await loyaltyClubService.updateCashbackSettings(businessId, {
    cashbackEnabled: bool(formData, "cashbackEnabled"),
    cashbackPercent: String(formData.get("cashbackPercent") ?? ""),
    cashbackCapPerOrder: String(formData.get("cashbackCapPerOrder") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/customers");
  return { ok: true };
}

export async function updateBirthdaySettingsAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await loyaltyClubService.updateBirthdaySettings(businessId, {
    birthdayMessageEnabled: bool(formData, "birthdayMessageEnabled"),
    birthdayMessageText: String(formData.get("birthdayMessageText") ?? ""),
    birthdayGiftAmount: String(formData.get("birthdayGiftAmount") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/customers");
  return { ok: true };
}

export async function sendBirthdayTestAction(
  _prevState: SendSmsActionState,
  formData: FormData
): Promise<SendSmsActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await loyaltyClubService.sendBirthdayTestMessage(businessId, {
    phone: String(formData.get("phone") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  return { ok: true, sent: result.sent, failed: result.failed };
}

export async function createTicketAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId, session } = await requireBusinessOwner();
  const result = await supportService.createTicket(businessId, session, {
    subject: String(formData.get("subject") ?? ""),
    category: String(formData.get("category") ?? ""),
    text: String(formData.get("text") ?? ""),
    attachmentUrl: String(formData.get("attachmentUrl") ?? ""),
    attachmentName: String(formData.get("attachmentName") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/support");
  redirect(`/dashboard/support/${result.ticketId}`);
}

export async function addTicketMessageAction(
  ticketId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId, session } = await requireBusinessOwner();
  const result = await supportService.addTicketMessage(businessId, session, ticketId, {
    text: String(formData.get("text") ?? ""),
    attachmentUrl: String(formData.get("attachmentUrl") ?? ""),
    attachmentName: String(formData.get("attachmentName") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath(`/dashboard/support/${ticketId}`);
  return { ok: true };
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  const { businessId } = await requireBusinessOwner();
  const result = await orderMgmtService.updateOrderStatus(businessId, { orderId, status });
  revalidatePath("/dashboard/orders");
  return result;
}

export async function createManualOrderAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();

  let items: unknown = [];
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    items = [];
  }

  const result = await orderMgmtService.createManualOrder(businessId, {
    type: String(formData.get("type") ?? ""),
    customerName: String(formData.get("customerName") ?? ""),
    customerPhone: String(formData.get("customerPhone") ?? ""),
    tableNumber: String(formData.get("tableNumber") ?? ""),
    address: String(formData.get("address") ?? ""),
    items,
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard/customers");
  return { ok: true };
}

function parseOptionGroups(formData: FormData) {
  try {
    return JSON.parse(String(formData.get("optionGroups") ?? "[]"));
  } catch {
    return [];
  }
}

export async function createProductAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await productService.createProduct(businessId, {
    categoryId: String(formData.get("categoryId") ?? ""),
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    price: String(formData.get("price") ?? ""),
    discountPercent: String(formData.get("discountPercent") ?? "0"),
    isActive: bool(formData, "isActive"),
    optionGroups: parseOptionGroups(formData),
    trackInventory: bool(formData, "trackInventory"),
    stock: String(formData.get("stock") ?? "0"),
    lowStockThreshold: String(formData.get("lowStockThreshold") ?? "5"),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/products");
  return { ok: true };
}

export async function updateProductAction(
  productId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await productService.updateProduct(businessId, productId, {
    categoryId: String(formData.get("categoryId") ?? ""),
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    price: String(formData.get("price") ?? ""),
    discountPercent: String(formData.get("discountPercent") ?? "0"),
    isActive: bool(formData, "isActive"),
    optionGroups: parseOptionGroups(formData),
    trackInventory: bool(formData, "trackInventory"),
    stock: String(formData.get("stock") ?? "0"),
    lowStockThreshold: String(formData.get("lowStockThreshold") ?? "5"),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/products");
  return { ok: true };
}

export async function deleteProductAction(productId: string) {
  const { businessId } = await requireBusinessOwner();
  const result = await productService.deleteProduct(businessId, productId);
  revalidatePath("/dashboard/products");
  return result;
}

export async function toggleProductActiveAction(productId: string, isActive: boolean) {
  const { businessId } = await requireBusinessOwner();
  const result = await productService.toggleProductActive(businessId, productId, isActive);
  revalidatePath("/dashboard/products");
  return result;
}

export async function createCategoryAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await categoryService.createCategory(businessId, {
    name: String(formData.get("name") ?? ""),
    icon: String(formData.get("icon") ?? ""),
    isActive: bool(formData, "isActive"),
    scheduleEnabled: bool(formData, "scheduleEnabled"),
    scheduleDays: formData.getAll("scheduleDays").map(String),
    scheduleStart: String(formData.get("scheduleStart") ?? ""),
    scheduleEnd: String(formData.get("scheduleEnd") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/categories");
  return { ok: true };
}

export async function updateCategoryAction(
  categoryId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await categoryService.updateCategory(businessId, categoryId, {
    name: String(formData.get("name") ?? ""),
    icon: String(formData.get("icon") ?? ""),
    isActive: bool(formData, "isActive"),
    scheduleEnabled: bool(formData, "scheduleEnabled"),
    scheduleDays: formData.getAll("scheduleDays").map(String),
    scheduleStart: String(formData.get("scheduleStart") ?? ""),
    scheduleEnd: String(formData.get("scheduleEnd") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/categories");
  return { ok: true };
}

export async function deleteCategoryAction(categoryId: string) {
  const { businessId } = await requireBusinessOwner();
  const result = await categoryService.deleteCategory(businessId, categoryId);
  revalidatePath("/dashboard/categories");
  return result;
}

export async function toggleCategoryActiveAction(categoryId: string, isActive: boolean) {
  const { businessId } = await requireBusinessOwner();
  const result = await categoryService.toggleCategoryActive(businessId, categoryId, isActive);
  revalidatePath("/dashboard/categories");
  return result;
}

export async function moveCategoryAction(categoryId: string, direction: "up" | "down") {
  const { businessId } = await requireBusinessOwner();
  const result = await categoryService.moveCategory(businessId, categoryId, direction);
  revalidatePath("/dashboard/categories");
  return result;
}

export async function createDiscountCodeAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await discountService.createDiscountCode(businessId, {
    name: String(formData.get("name") ?? ""),
    code: String(formData.get("code") ?? ""),
    description: String(formData.get("description") ?? ""),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
    isActive: bool(formData, "isActive"),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/discounts");
  return { ok: true };
}

export async function updateDiscountCodeAction(
  discountId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await discountService.updateDiscountCode(businessId, discountId, {
    name: String(formData.get("name") ?? ""),
    code: String(formData.get("code") ?? ""),
    description: String(formData.get("description") ?? ""),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
    isActive: bool(formData, "isActive"),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/discounts");
  return { ok: true };
}

export async function createAutoDiscountAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await discountService.createAutoDiscount(businessId, {
    name: String(formData.get("name") ?? ""),
    percent: String(formData.get("percent") ?? ""),
    scope: String(formData.get("scope") ?? "ALL_MENU"),
    categoryIds: formData.getAll("categoryIds").map(String),
    productId: String(formData.get("productId") ?? ""),
    description: String(formData.get("description") ?? ""),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
    isActive: bool(formData, "isActive"),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/discounts");
  return { ok: true };
}

export async function updateAutoDiscountAction(
  discountId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireBusinessOwner();
  const result = await discountService.updateAutoDiscount(businessId, discountId, {
    name: String(formData.get("name") ?? ""),
    percent: String(formData.get("percent") ?? ""),
    scope: String(formData.get("scope") ?? "ALL_MENU"),
    categoryIds: formData.getAll("categoryIds").map(String),
    productId: String(formData.get("productId") ?? ""),
    description: String(formData.get("description") ?? ""),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
    isActive: bool(formData, "isActive"),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/discounts");
  return { ok: true };
}

export async function deleteDiscountAction(discountId: string) {
  const { businessId } = await requireBusinessOwner();
  const result = await discountService.deleteDiscount(businessId, discountId);
  revalidatePath("/dashboard/discounts");
  return result;
}

export async function toggleDiscountActiveAction(discountId: string, isActive: boolean) {
  const { businessId } = await requireBusinessOwner();
  const result = await discountService.toggleDiscountActive(businessId, discountId, isActive);
  revalidatePath("/dashboard/discounts");
  return result;
}

export async function createStaffUserAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireOwnerRole();
  const result = await userMgmtService.createStaffUser(businessId, {
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    role: String(formData.get("role") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/users");
  return { ok: true, tempPassword: result.tempPassword };
}

export async function updateStaffUserAction(
  userId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { businessId } = await requireOwnerRole();
  const result = await userMgmtService.updateStaffUser(businessId, userId, {
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    role: String(formData.get("role") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard/users");
  return { ok: true };
}
