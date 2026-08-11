import "server-only";
import * as repo from "@/features/menu/repositories/menu-repository";
import { formatOpeningHours } from "@/features/menu/utils/business-hours";

function formatRating(avg: number | null): string | null {
  return avg !== null ? avg.toFixed(1) : null;
}

export async function getMenuEntryData(slug: string) {
  const business = await repo.getBusiness(slug);
  if (!business) return null;

  const [ratingAgg, recentReviews] = await Promise.all([
    repo.getBusinessRatingAggregate(business.id),
    repo.getRecentReviews(business.id, 2),
  ]);

  return {
    business: {
      ...business,
      openingHours: formatOpeningHours(business.openingHoursStart, business.openingHoursEnd),
    },
    rating: formatRating(ratingAgg.avg),
    recentReviews,
  };
}

export async function getBusinessAccentColor(slug: string) {
  const business = await repo.getBusinessAccentColor(slug);
  return business?.accentColor ?? null;
}

export async function getCategoryBrowserData(slug: string) {
  const business = await repo.getBusiness(slug);
  if (!business) return null;

  const [categories, products] = await Promise.all([
    repo.getCategories(business.id),
    repo.getProducts(business.id),
  ]);
  return { business, categories, products };
}

export async function getItemDetailData(productId: string) {
  const product = await repo.getProduct(productId);
  if (!product) return null;
  const ratingAgg = await repo.getProductRatingAggregate(productId);
  return { product, rating: formatRating(ratingAgg.avg) };
}

export async function getItemReviewsData(productId: string) {
  const product = await repo.getProduct(productId);
  if (!product) return null;
  const [reviews, ratingAgg] = await Promise.all([
    repo.getProductReviews(productId),
    repo.getProductRatingAggregate(productId),
  ]);
  return { product, reviews, rating: formatRating(ratingAgg.avg) ?? "—", count: ratingAgg.count };
}

export function getReceiptData(orderId: string) {
  return repo.getOrder(orderId);
}

export async function getReviewFormData(orderId: string) {
  const order = await repo.getOrder(orderId);
  if (!order) return null;
  return {
    order,
    alreadyReviewed: order.reviews.length > 0,
    pointsEligible: order.customerAccountId !== null,
  };
}
