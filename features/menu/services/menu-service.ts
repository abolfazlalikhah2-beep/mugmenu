import "server-only";
import * as repo from "@/features/menu/repositories/menu-repository";
import { isCategoryVisibleNow } from "@/features/menu/utils/category-schedule";
import { getWalletBalance } from "@/features/customer/services/wallet-service";
import { businessHasFeature } from "@/features/plans/services/plan-service";
import type { AutoDiscountDef } from "@/features/menu/services/order-flow";

function formatRating(avg: number | null): string | null {
  return avg !== null ? avg.toFixed(1) : null;
}

/**
 * Everything the merged entry+browse screen needs — identity/hours/reviews
 * (previously getMenuEntryData) plus categories/products (previously
 * getCategoryBrowserData) — in one request. The two screens were merged
 * into one browse-first page (Menu Flow.dc.html's screen 1: identity →
 * category chips → product list, no order-type-picker step); order type is
 * now chosen at checkout instead, via cart-page-client.tsx's DeliveryTabs.
 */
export async function getMenuMainData(slug: string) {
  const business = await repo.getBusinessWithHours(slug);
  if (!business) return null;

  const [ratingAgg, recentReviews, categories, products] = await Promise.all([
    repo.getBusinessRatingAggregate(business.id),
    repo.getRecentReviews(business.id, 2),
    repo.getCategories(business.id),
    repo.getProducts(business.id),
  ]);

  return {
    business,
    rating: formatRating(ratingAgg.avg),
    recentReviews,
    categories: categories.filter((c) => isCategoryVisibleNow(c)),
    products,
  };
}

export async function getBusinessAccentColor(slug: string) {
  const business = await repo.getBusinessAccentColor(slug);
  return business?.accentColor ?? null;
}

export interface BusinessSeoData {
  slug: string;
  name: string;
  description: string | null;
  address: string | null;
  logoUrl: string | null;
  planKey: string;
  customDomain: string | null;
}

/** Backs the cafe layout's generateMetadata + JSON-LD (including the canonical URL via getMenuUrl) — repo.getBusinessSeoInfo is request-memoized (React cache()). */
export async function getBusinessSeoData(slug: string): Promise<BusinessSeoData | null> {
  const business = await repo.getBusinessSeoInfo(slug);
  if (!business) return null;
  return {
    slug: business.slug,
    name: business.name,
    description: business.description,
    address: business.address,
    logoUrl: business.logoUrl,
    planKey: business.plan.key,
    customDomain: business.customDomain,
  };
}

export interface SitemapBusiness {
  slug: string;
  planKey: string;
  customDomain: string | null;
}

export async function getSitemapBusinesses(): Promise<SitemapBusiness[]> {
  const businesses = await repo.getActiveBusinessSlugs();
  return businesses.map((b) => ({ slug: b.slug, planKey: b.plan.key, customDomain: b.customDomain }));
}

/** Custom-domain routing (opal/zomorrod plans (isOrderingEnabled)) — see proxy.ts. */
export function findSlugByCustomDomain(customDomain: string) {
  return repo.getBusinessSlugByCustomDomain(customDomain);
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
  /** false for firuze/yashm (no isOrderingEnabled) businesses, or when the owner has manually toggled "سفارش‌گیری" off — cart/checkout must stay blocked either way. */
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

  const [autoDiscounts, walletBalance, canOrderFeature] = await Promise.all([
    repo.getActiveAutoDiscounts(business.id),
    customerAccountId ? getWalletBalance(customerAccountId) : Promise.resolve(null),
    businessHasFeature(business.id, "order.three_mode"),
  ]);
  // Plan gate AND the owner's manual "سفارش‌گیری" toggle both have to allow
  // ordering — same combined check as the entry/menu pages and the
  // authoritative one in order-service.ts's createOrder().
  const hasOrdering = canOrderFeature && business.isAcceptingOrders;

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
