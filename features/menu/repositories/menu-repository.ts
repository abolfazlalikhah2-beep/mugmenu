import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";
import type { OrderType, VisitSource } from "@/lib/generated/prisma/enums";

/** Active AUTOMATIC discounts for a business, within their date window (open-ended start/end allowed) — see order-service.ts's checkout discount step. */
export function getActiveAutoDiscounts(businessId: string) {
  const now = new Date();
  return prisma.discount.findMany({
    where: {
      businessId,
      type: "AUTOMATIC",
      isActive: true,
      OR: [{ startDate: null }, { startDate: { lte: now } }],
      AND: [{ OR: [{ endDate: null }, { endDate: { gte: now } }] }],
    },
  });
}

/** Memoized per-request — layout.tsx and page.tsx both look up the business by slug on every navigation. */
export const getBusiness = cache((slug: string) => {
  return prisma.business.findUnique({ where: { slug } });
});

/** Entry page only — includes the per-day hours relation the other business fetches on this page don't need. */
export function getBusinessWithHours(slug: string) {
  return prisma.business.findUnique({
    where: { slug },
    include: { hours: { orderBy: { dayOfWeek: "asc" } } },
  });
}

/** Just the accent color, for the per-business CSS var theming in CafeLayout. */
export function getBusinessAccentColor(slug: string) {
  return prisma.business.findUnique({ where: { slug }, select: { accentColor: true } });
}

/** CafeLayout's generateMetadata + JSON-LD — slug/planKey/customDomain are for getMenuUrl's canonical URL. Memoized per-request like getBusiness above. */
export const getBusinessSeoInfo = cache((slug: string) => {
  return prisma.business.findUnique({
    where: { slug },
    select: {
      slug: true,
      name: true,
      description: true,
      address: true,
      logoUrl: true,
      customDomain: true,
      plan: { select: { key: true } },
    },
  });
});

/** For sitemap.xml's per-business canonical URL (see getMenuUrl) — isSuspended is this schema's "active/inactive" flag, there's no separate isActive column. */
export function getActiveBusinessSlugs() {
  return prisma.business.findMany({
    where: { isSuspended: false },
    select: { slug: true, customDomain: true, plan: { select: { key: true } } },
  });
}

/** Custom-domain routing (opal/zomorrod plans (isOrderingEnabled)) — see proxy.ts. Excludes suspended businesses like every other public-menu lookup. */
export function getBusinessSlugByCustomDomain(customDomain: string) {
  return prisma.business.findFirst({
    where: { customDomain, isSuspended: false },
    select: { slug: true },
  });
}

export function getCategories(businessId: string) {
  return prisma.category.findMany({
    where: { businessId, isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export function getProducts(businessId: string) {
  return prisma.product.findMany({
    where: { businessId, isActive: true },
    orderBy: { createdAt: "asc" },
  });
}

export function getProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      optionGroups: {
        orderBy: { sortOrder: "asc" },
        include: { options: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });
}

export function findProductsByIds(ids: string[]) {
  return prisma.product.findMany({ where: { id: { in: ids } } });
}

/** Options selected in a cart line, looked up server-side so the client can never dictate its own price (see order-service.ts). */
export function findOptionsByIds(ids: string[]) {
  return prisma.productOption.findMany({
    where: { id: { in: ids } },
    include: { group: { select: { id: true, name: true, productId: true, required: true } } },
  });
}

export function getProductReviews(productId: string) {
  return prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
  });
}

export function getRecentReviews(businessId: string, take: number) {
  return prisma.review.findMany({
    where: { businessId },
    orderBy: { createdAt: "desc" },
    take,
  });
}

async function ratingAggregate(where: { businessId: string } | { productId: string }) {
  const result = await prisma.review.aggregate({
    where,
    _avg: { rating: true },
    _count: true,
  });
  return { avg: result._avg.rating, count: result._count };
}

export function getBusinessRatingAggregate(businessId: string) {
  return ratingAggregate({ businessId });
}

export function getProductRatingAggregate(productId: string) {
  return ratingAggregate({ productId });
}

export function getOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true, options: true } },
      business: true,
      reviews: true,
      survey: true,
    },
  });
}

export interface CreateOrderItemData {
  productId: string;
  quantity: number;
  unitPrice: number;
  note?: string;
  options: { groupName: string; optionName: string; extraPrice: number }[];
}

export interface CreateOrderData {
  businessId: string;
  type: OrderType;
  customerName: string;
  customerPhone: string;
  tableNumber?: string;
  address?: string;
  estimatedTime?: string;
  totalPrice: number;
  /** Bill breakdown snapshot — see Order's schema comment. */
  subtotal: number;
  packagingFeeAmount: number;
  serviceFeeAmount: number;
  taxAmount: number;
  discountAmount?: number;
  discountName?: string;
  walletRedeemedAmount?: number;
  /** Set when placed while logged in to a customer account — see features/customer. */
  customerAccountId?: string;
  /** Daily sequential receipt number, pre-assigned by the caller via lib/invoice-number.ts. */
  receiptInvoiceNumber: string;
  items: CreateOrderItemData[];
}

export function createOrder(data: CreateOrderData) {
  const { items, ...rest } = data;
  return prisma.order.create({
    data: {
      ...rest,
      items: {
        create: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          note: i.note,
          options: { create: i.options },
        })),
      },
    },
  });
}

export interface CreateReviewData {
  businessId: string;
  orderId: string;
  customerName: string;
  anonymous: boolean;
  rating: number;
  comment?: string;
  tags: string[];
  /** One Review row is created per product id; an empty list creates a single business-level review (productId null). */
  productIds: string[];
}

export function createReviews(data: CreateReviewData) {
  const { productIds, ...rest } = data;
  const targets = productIds.length > 0 ? productIds : [null];
  return prisma.$transaction(
    targets.map((productId) => prisma.review.create({ data: { ...rest, productId } }))
  );
}

export function upsertOrderSurvey(data: {
  orderId: string;
  taste: string;
  speed: string;
  packaging: string;
}) {
  const { orderId, ...answers } = data;
  return prisma.orderSurvey.upsert({
    where: { orderId },
    create: { orderId, ...answers },
    update: answers,
  });
}

// ---------- Menu visits (analytics) ----------

export function createMenuEntryVisit(businessId: string, source: VisitSource) {
  return prisma.menuVisit.create({ data: { businessId, source } });
}

export function createItemView(businessId: string, productId: string) {
  return prisma.menuVisit.create({ data: { businessId, productId } });
}
