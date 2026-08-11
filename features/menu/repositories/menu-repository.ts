import "server-only";
import { prisma } from "@/lib/db";
import type { OrderType } from "@/lib/generated/prisma/enums";

export function getBusiness(slug: string) {
  return prisma.business.findUnique({ where: { slug } });
}

/** Just the accent color, for the per-business CSS var theming in CafeLayout. */
export function getBusinessAccentColor(slug: string) {
  return prisma.business.findUnique({ where: { slug }, select: { accentColor: true } });
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
    include: { category: true },
  });
}

export function findProductsByIds(ids: string[]) {
  return prisma.product.findMany({ where: { id: { in: ids } } });
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
    include: { items: { include: { product: true } }, business: true, reviews: true, survey: true },
  });
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
  /** Set when placed while logged in to a customer account — see features/customer. */
  customerAccountId?: string;
  items: { productId: string; quantity: number; unitPrice: number }[];
}

export function createOrder(data: CreateOrderData) {
  const { items, ...rest } = data;
  return prisma.order.create({
    data: { ...rest, items: { create: items } },
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
