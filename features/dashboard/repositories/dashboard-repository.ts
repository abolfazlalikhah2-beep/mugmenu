import "server-only";
import { prisma } from "@/lib/db";
import type {
  OrderStatus,
  OrderType,
  DiscountType,
  DiscountScope,
  PrinterConnectionType,
  SmsAudience,
  SmsMessageStatus,
  TicketCategory,
  TicketAuthorType,
  TicketStatus,
  CourierVehicleType,
} from "@/lib/generated/prisma/enums";

// ---------- Business ----------

export function getBusinessById(id: string) {
  return prisma.business.findUnique({ where: { id } });
}

export function getBusinessWithPlan(id: string) {
  return prisma.business.findUnique({ where: { id }, include: { plan: true } });
}

export function updateBusiness(id: string, data: Record<string, unknown>) {
  return prisma.business.update({ where: { id }, data });
}

export function createBusiness(data: {
  slug: string;
  name: string;
  nameEn?: string;
  phone?: string;
  address?: string;
  description?: string;
  logoUrl?: string;
  customDomain?: string;
  planId: string;
}) {
  return prisma.business.create({ data });
}

export function linkUserToBusiness(userId: string, businessId: string) {
  return prisma.user.update({ where: { id: userId }, data: { businessId } });
}

// ---------- Orders ----------

export function countOrders(businessId: string, range?: { gte: Date; lt: Date }) {
  return prisma.order.count({ where: { businessId, ...(range ? { createdAt: range } : {}) } });
}

export async function sumRevenue(businessId: string, range: { gte: Date; lt: Date }) {
  const result = await prisma.order.aggregate({
    where: { businessId, createdAt: range },
    _sum: { totalPrice: true },
  });
  return result._sum.totalPrice ?? 0;
}

export async function countDistinctCustomers(businessId: string, range: { gte: Date; lt: Date }) {
  const rows = await prisma.order.findMany({
    where: { businessId, createdAt: range },
    select: { customerPhone: true },
    distinct: ["customerPhone"],
  });
  return rows.length;
}

/** Raw creation timestamps for this month — bucketed by hour-of-day in the service layer. */
export function getOrderTimestampsThisMonth(businessId: string, since: Date) {
  return prisma.order.findMany({
    where: { businessId, createdAt: { gte: since } },
    select: { createdAt: true },
  });
}

/** All order lines for this business — aggregated into category/product sales in the service layer. */
export function getOrderItemsWithProduct(businessId: string) {
  return prisma.orderItem.findMany({
    where: { order: { businessId } },
    include: { product: { include: { category: true } } },
  });
}

export function getRecentOrders(businessId: string, take: number) {
  return prisma.order.findMany({
    where: { businessId },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export function getOrders(
  businessId: string,
  filter: { status?: OrderStatus; search?: string }
) {
  return prisma.order.findMany({
    where: {
      businessId,
      ...(filter.status ? { status: filter.status } : {}),
      ...(filter.search
        ? {
            OR: [
              { customerName: { contains: filter.search, mode: "insensitive" } },
              { customerPhone: { contains: filter.search } },
              { id: { contains: filter.search } },
            ],
          }
        : {}),
    },
    include: { items: { include: { product: true } }, courier: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export function getOrderWithItems(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true, options: true } }, courier: { select: { id: true, name: true } } },
  });
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  return prisma.order.update({ where: { id }, data: { status } });
}

export function assignCourierToOrder(orderId: string, courierId: string | null) {
  return prisma.order.update({ where: { id: orderId }, data: { courierId } });
}

// ---------- Couriers ----------

/** _count.orders is scoped to "in flight" statuses — the couriers list's busy/free indicator (see courier-aggregation.ts). */
export function getCouriers(businessId: string) {
  return prisma.courier.findMany({
    where: { businessId },
    orderBy: { createdAt: "asc" },
    include: {
      _count: { select: { orders: { where: { status: { notIn: ["DELIVERED", "CANCELED"] } } } } },
    },
  });
}

/** Only active couriers, for the order detail page's assignment dropdown. */
export function getActiveCouriers(businessId: string) {
  return prisma.courier.findMany({
    where: { businessId, isActive: true },
    orderBy: { name: "asc" },
    include: {
      _count: { select: { orders: { where: { status: { notIn: ["DELIVERED", "CANCELED"] } } } } },
    },
  });
}

export function getCourierForEdit(id: string) {
  return prisma.courier.findUnique({ where: { id } });
}

export interface CourierInput {
  businessId: string;
  name: string;
  phone: string;
  vehicleType: CourierVehicleType;
  nationalCode?: string;
  coverageZones: string[];
  isActive: boolean;
}

export function createCourier(data: CourierInput) {
  return prisma.courier.create({ data });
}

export function updateCourier(id: string, data: Record<string, unknown>) {
  return prisma.courier.update({ where: { id }, data });
}

export function deleteCourier(id: string) {
  return prisma.courier.delete({ where: { id } });
}

/** Today's DELIVERY orders (assigned or not) — grouped by courierId in courier-aggregation.ts for the "امروز" column + summary tile. */
export function getTodayDeliveryOrders(businessId: string, since: Date) {
  return prisma.order.findMany({
    where: { businessId, type: "DELIVERY", createdAt: { gte: since } },
    select: { courierId: true },
  });
}

export interface CreateManualOrderData {
  businessId: string;
  type: OrderType;
  customerName: string;
  customerPhone: string;
  tableNumber?: string;
  address?: string;
  totalPrice: number;
  items: { productId: string; quantity: number; unitPrice: number }[];
}

export function createManualOrder(data: CreateManualOrderData) {
  const { items, ...rest } = data;
  return prisma.order.create({ data: { ...rest, items: { create: items } } });
}

// ---------- Customers ----------

/** Raw order rows aggregated into per-customer summaries in the service layer. */
export function getCustomerOrders(businessId: string, search?: string) {
  return prisma.order.findMany({
    where: {
      businessId,
      ...(search
        ? {
            OR: [
              { customerName: { contains: search, mode: "insensitive" } },
              { customerPhone: { contains: search } },
            ],
          }
        : {}),
    },
    select: { customerName: true, customerPhone: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
}

// ---------- Products ----------

const optionGroupsInclude = {
  optionGroups: {
    orderBy: { sortOrder: "asc" as const },
    include: { options: { orderBy: { sortOrder: "asc" as const } } },
  },
};

export function getProducts(businessId: string) {
  return prisma.product.findMany({
    where: { businessId },
    include: { category: true, ...optionGroupsInclude },
    orderBy: { createdAt: "desc" },
  });
}

export function getProductForEdit(id: string) {
  return prisma.product.findUnique({ where: { id }, include: optionGroupsInclude });
}

export function getProductsByIds(businessId: string, ids: string[]) {
  return prisma.product.findMany({ where: { id: { in: ids }, businessId } });
}

export interface ProductOptionGroupInput {
  name: string;
  required: boolean;
  multiSelect: boolean;
  options: { name: string; extraPrice: number; isDefault: boolean }[];
}

function optionGroupsCreateData(groups: ProductOptionGroupInput[]) {
  return groups.map((g, i) => ({
    name: g.name,
    required: g.required,
    multiSelect: g.multiSelect,
    sortOrder: i,
    options: {
      create: g.options.map((o, j) => ({
        name: o.name,
        extraPrice: o.extraPrice,
        isDefault: o.isDefault,
        sortOrder: j,
      })),
    },
  }));
}

export function createProduct(data: {
  businessId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  discountPercent?: number;
  imageUrl?: string;
  optionGroups?: ProductOptionGroupInput[];
  trackInventory?: boolean;
  stock?: number;
  lowStockThreshold?: number;
}) {
  const { optionGroups, ...rest } = data;
  return prisma.product.create({
    data: {
      ...rest,
      ...(optionGroups && optionGroups.length > 0
        ? { optionGroups: { create: optionGroupsCreateData(optionGroups) } }
        : {}),
    },
  });
}

export function updateProduct(
  id: string,
  data: Record<string, unknown> & { optionGroups?: ProductOptionGroupInput[] }
) {
  const { optionGroups, ...rest } = data;
  return prisma.product.update({
    where: { id },
    data: {
      ...rest,
      // Nested groups/options are replaced wholesale on every save — simpler
      // and safer than diffing, and cheap since a product has at most a
      // handful of option groups. ON DELETE CASCADE on ProductOption cleans
      // up options when their group is deleted here.
      ...(optionGroups
        ? { optionGroups: { deleteMany: {}, create: optionGroupsCreateData(optionGroups) } }
        : {}),
    },
  });
}

export function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

// ---------- Categories ----------

export function getCategoriesWithCounts(businessId: string) {
  return prisma.category.findMany({
    where: { businessId },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export function getCategoryForEdit(id: string) {
  return prisma.category.findUnique({ where: { id } });
}

export async function nextCategorySortOrder(businessId: string) {
  const last = await prisma.category.findFirst({
    where: { businessId },
    orderBy: { sortOrder: "desc" },
  });
  return (last?.sortOrder ?? -1) + 1;
}

export function createCategory(data: {
  businessId: string;
  name: string;
  icon?: string;
  imageUrl?: string;
  sortOrder: number;
  scheduleEnabled?: boolean;
  scheduleDays?: number[];
  scheduleStart?: string;
  scheduleEnd?: string;
}) {
  return prisma.category.create({ data });
}

export function updateCategory(id: string, data: Record<string, unknown>) {
  return prisma.category.update({ where: { id }, data });
}

export function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}

export function countProductsInCategory(categoryId: string) {
  return prisma.product.count({ where: { categoryId } });
}

export async function swapCategorySortOrder(a: { id: string; sortOrder: number }, b: { id: string; sortOrder: number }) {
  await prisma.$transaction([
    prisma.category.update({ where: { id: a.id }, data: { sortOrder: b.sortOrder } }),
    prisma.category.update({ where: { id: b.id }, data: { sortOrder: a.sortOrder } }),
  ]);
}

// ---------- Discounts ----------

export function getDiscounts(businessId: string) {
  return prisma.discount.findMany({
    where: { businessId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
}

export function getDiscountForEdit(id: string) {
  return prisma.discount.findUnique({ where: { id } });
}

export function findDiscountByCode(businessId: string, code: string, excludeId?: string) {
  return prisma.discount.findFirst({
    where: { businessId, code, ...(excludeId ? { id: { not: excludeId } } : {}) },
  });
}

export function createDiscount(data: {
  businessId: string;
  type: DiscountType;
  name: string;
  description?: string;
  code?: string;
  percent?: number;
  scope?: DiscountScope;
  categoryIds?: string[];
  productId?: string;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
}) {
  return prisma.discount.create({ data });
}

export function updateDiscount(id: string, data: Record<string, unknown>) {
  return prisma.discount.update({ where: { id }, data });
}

export function deleteDiscount(id: string) {
  return prisma.discount.delete({ where: { id } });
}

// ---------- Printers ----------

export function getPrinters(businessId: string) {
  return prisma.printer.findMany({
    where: { businessId },
    orderBy: { createdAt: "asc" },
  });
}

export function getPrinterForEdit(id: string) {
  return prisma.printer.findUnique({ where: { id } });
}

export interface PrinterInput {
  businessId: string;
  name: string;
  model?: string;
  connectionType: PrinterConnectionType;
  ipAddress?: string;
  port?: string;
  paperSize: string;
  copies: number;
}

export function createPrinter(data: PrinterInput) {
  return prisma.printer.create({ data });
}

export function updatePrinter(id: string, data: Omit<PrinterInput, "businessId">) {
  return prisma.printer.update({ where: { id }, data });
}

export function setPrinterTestResult(id: string, isConnected: boolean) {
  return prisma.printer.update({
    where: { id },
    data: { isConnected, lastTestedAt: new Date() },
  });
}

// ---------- Contacts (SMS phonebook) ----------

export function getContacts(businessId: string, search?: string) {
  return prisma.contact.findMany({
    where: {
      businessId,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { phone: { contains: search } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

export function getContactsByIds(businessId: string, ids: string[]) {
  return prisma.contact.findMany({ where: { id: { in: ids }, businessId } });
}

export function findContactByPhone(businessId: string, phone: string) {
  return prisma.contact.findUnique({ where: { businessId_phone: { businessId, phone } } });
}

export function createContact(data: { businessId: string; name: string; phone: string }) {
  return prisma.contact.create({ data });
}

export function getContactForDelete(id: string) {
  return prisma.contact.findUnique({ where: { id } });
}

export function deleteContact(id: string) {
  return prisma.contact.delete({ where: { id } });
}

// ---------- SMS messages ----------

export interface CreateSmsMessageData {
  businessId: string;
  text: string;
  audience?: SmsAudience;
  recipientCount: number;
  status: SmsMessageStatus;
}

export function createSmsMessage(data: CreateSmsMessageData) {
  return prisma.smsMessage.create({ data });
}

export function getSmsMessages(businessId: string, status?: SmsMessageStatus) {
  return prisma.smsMessage.findMany({
    where: { businessId, ...(status ? { status } : {}) },
    orderBy: { createdAt: "desc" },
  });
}

// ---------- Support tickets ----------

export function getTickets(businessId: string) {
  return prisma.ticket.findMany({
    where: { businessId },
    orderBy: { updatedAt: "desc" },
  });
}

export function getTicketWithMessages(id: string) {
  return prisma.ticket.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
}

export interface CreateTicketData {
  businessId: string;
  subject: string;
  category: TicketCategory;
  authorType: TicketAuthorType;
  authorName: string;
  text: string;
  attachmentUrl?: string;
  attachmentName?: string;
}

export function createTicketWithMessage(data: CreateTicketData) {
  const { text, attachmentUrl, attachmentName, authorType, authorName, ...ticketFields } = data;
  return prisma.ticket.create({
    data: {
      ...ticketFields,
      messages: { create: { authorType, authorName, text, attachmentUrl, attachmentName } },
    },
  });
}

export interface AddTicketMessageData {
  ticketId: string;
  authorType: TicketAuthorType;
  authorName: string;
  text: string;
  attachmentUrl?: string;
  attachmentName?: string;
  /** Reopen an ANSWERED/CLOSED ticket back to OPEN — see support-service.ts. */
  reopenStatus?: TicketStatus;
}

export function addTicketMessage(data: AddTicketMessageData) {
  const { ticketId, reopenStatus, ...messageFields } = data;
  return prisma.$transaction([
    prisma.ticketMessage.create({ data: { ticketId, ...messageFields } }),
    prisma.ticket.update({
      where: { id: ticketId },
      data: { updatedAt: new Date(), ...(reopenStatus ? { status: reopenStatus } : {}) },
    }),
  ]);
}

// ---------- Reports ----------

export function getOrdersForReport(businessId: string, since: Date) {
  return prisma.order.findMany({
    where: { businessId, createdAt: { gte: since } },
    select: { createdAt: true, totalPrice: true },
  });
}

export function getOrderItemsForReport(businessId: string, since: Date) {
  return prisma.orderItem.findMany({
    where: { order: { businessId, createdAt: { gte: since } } },
    select: {
      quantity: true,
      productId: true,
      product: { select: { name: true, imageUrl: true, category: { select: { name: true } } } },
      order: { select: { createdAt: true } },
    },
  });
}

// ---------- Menu analytics (menu visits) ----------

export function getMenuEntryVisits(businessId: string, since: Date) {
  return prisma.menuVisit.findMany({
    where: { businessId, productId: null, createdAt: { gte: since } },
    select: { createdAt: true, source: true },
  });
}

export function getMenuItemViews(businessId: string, since: Date) {
  return prisma.menuVisit.findMany({
    where: { businessId, productId: { not: null }, createdAt: { gte: since } },
    select: {
      createdAt: true,
      productId: true,
      product: { select: { name: true, imageUrl: true, category: { select: { name: true } } } },
    },
  });
}

// ---------- Loyalty club (dashboard "مشتریان" › "باشگاه مشتریان") ----------

/** Real باشگاه مشتریان members — CustomerAccount rows, not the guest-order-derived list on the "لیست مشتریان" tab. Order count + last order date for the members table and send-audience filters. */
export function getLoyaltyMembers(businessId: string) {
  return prisma.customerAccount.findMany({
    where: { businessId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { orders: true } },
      orders: { orderBy: { createdAt: "desc" }, take: 1, select: { createdAt: true } },
    },
  });
}

/** Cashback ledger entries across all of this business's members, for the growth/trend chart on the loyalty dashboard. */
export function getCashbackLedger(businessId: string, since: Date) {
  return prisma.walletTransaction.findMany({
    where: { type: "CASHBACK_EARNED", createdAt: { gte: since }, customerAccount: { businessId } },
    select: { amount: true, createdAt: true },
  });
}
