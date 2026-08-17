import "server-only";
import * as repo from "@/features/menu/repositories/menu-repository";
import { formatOpeningHours } from "@/features/menu/utils/business-hours";
import { isCategoryVisibleNow } from "@/features/menu/utils/category-schedule";
import { getWalletBalance } from "@/features/customer/services/wallet-service";
import { businessHasFeature } from "@/features/plans/services/plan-service";
import type { AutoDiscountDef } from "@/features/menu/services/order-flow";

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

export interface BusinessSeoData {
  name: string;
  description: string | null;
  address: string | null;
  logoUrl: string | null;
}

/** Backs the cafe layout's generateMetadata + JSON-LD — repo.getBusiness is request-memoized (React cache()), so calling this from both doesn't cost a second query. */
export async function getBusinessSeoData(slug: string): Promise<BusinessSeoData | null> {
  const business = await repo.getBusiness(slug);
  if (!business) return null;
  return {
    name: business.name,
    description: business.description,
    address: business.address,
    logoUrl: business.logoUrl,
  };
}

export interface SitemapBusiness {
  slug: string;
}

export function getSitemapBusinesses(): Promise<SitemapBusiness[]> {
  return repo.getActiveBusinessSlugs();
}

export async function getCategoryBrowserData(slug: string) {
  const business = await repo.getBusiness(slug);
  if (!business) return null;

  const [categories, products] = await Promise.all([
    repo.getCategories(business.id),
    repo.getProducts(business.id),
  ]);
  return { business, categories: categories.filter((c) => isCategoryVisibleNow(c)), products };
}

/** slug is not just a display concern — a product/order id from another business must 404 here, not render under the wrong tenant's URL. */
export async function getItemDetailData(slug: string, productId: string) {
  const business = await repo.getBusiness(slug);
  if (!business) return null;
  const product = await repo.getProduct(productId);
  if (!product || product.businessId !== business.id) return null;
  const ratingAgg = await repo.getProductRatingAggregate(productId);
  return { product, rating: formatRating(ratingAgg.avg) };
}

export async function getItemReviewsData(slug: string, productId: string) {
  const business = await repo.getBusiness(slug);
  if (!business) return null;
  const product = await repo.getProduct(productId);
  if (!product || product.businessId !== business.id) return null;
  const [reviews, ratingAgg] = await Promise.all([
    repo.getProductReviews(productId),
    repo.getProductRatingAggregate(productId),
  ]);
  return { product, reviews, rating: formatRating(ratingAgg.avg) ?? "—", count: ratingAgg.count };
}

export async function getReceiptData(slug: string, orderId: string) {
  const business = await repo.getBusiness(slug);
  if (!business) return null;
  const order = await repo.getOrder(orderId);
  if (!order || order.businessId !== business.id) return null;
  return order;
}

export interface CartCheckoutContext {
  packagingFee: number;
  serviceFeePercent: number;
  taxPercent: number;
  autoDiscounts: AutoDiscountDef[];
  /** null when checking out as a guest (not logged in) — no wallet to redeem from. */
  walletBalance: number | null;
  /** false for menu-display plan businesses — cart/checkout must stay blocked. */
  hasOrdering: boolean;
  /** Which order types this business currently accepts (dashboard settings > order settings) — the cart's type tabs must only offer these. */
  acceptsDineIn: boolean;
  acceptsTakeaway: boolean;
  acceptsDelivery: boolean;
}

/** Fee/discount/wallet context the cart page needs to preview a bill before submitting — order-service.ts recomputes all of this itself at checkout, this is display-only. */
export async function getCartCheckoutContext(
  slug: string,
  customerAccountId?: string
): Promise<CartCheckoutContext | null> {
  const business = await repo.getBusiness(slug);
  if (!business) return null;

  const [autoDiscounts, walletBalance, hasOrdering] = await Promise.all([
    repo.getActiveAutoDiscounts(business.id),
    customerAccountId ? getWalletBalance(customerAccountId) : Promise.resolve(null),
    businessHasFeature(business.id, "order.three_mode"),
  ]);

  return {
    packagingFee: business.packagingFee,
    serviceFeePercent: business.serviceFeePercent,
    taxPercent: business.taxPercent,
    autoDiscounts: autoDiscounts.map(
      (d): AutoDiscountDef => ({
        id: d.id,
        name: d.name,
        percent: d.percent ?? 0,
        scope: d.scope ?? "ALL_MENU",
        categoryIds: d.categoryIds,
        productId: d.productId,
      })
    ),
    walletBalance,
    hasOrdering,
    acceptsDineIn: business.acceptsDineIn,
    acceptsTakeaway: business.acceptsTakeaway,
    acceptsDelivery: business.acceptsDelivery,
  };
}

export async function getReviewFormData(slug: string, orderId: string) {
  const business = await repo.getBusiness(slug);
  if (!business) return null;
  const order = await repo.getOrder(orderId);
  if (!order || order.businessId !== business.id) return null;
  return {
    order,
    alreadyReviewed: order.reviews.length > 0,
    pointsEligible: order.customerAccountId !== null,
  };
}
