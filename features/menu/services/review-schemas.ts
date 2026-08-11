import { z } from "zod";

/**
 * Quick-pick tag chips on the review form ("چه چیزی برایتان خوب بود؟").
 * Persian text stored directly on Review.tags (String[], not an enum — see
 * schema comment) since they're display-only today, not filtered/reported on.
 */
export const TAG_OPTIONS = [
  "خوش‌طعم",
  "گرم و تازه",
  "بسته‌بندی مرتب",
  "تحویل سریع",
  "مقدار مناسب",
  "ارزش خرید",
] as const;

/** English keys stored on OrderSurvey, mapped to Persian labels in the UI (same convention as OrderType/TYPE_LABEL). */
export const TASTE_OPTIONS = ["EXCELLENT", "GOOD", "AVERAGE", "POOR"] as const;
export const SPEED_OPTIONS = ["EARLY", "ON_TIME", "LATE", "VERY_LATE"] as const;
export const PACKAGING_OPTIONS = ["NEAT", "ACCEPTABLE", "POOR"] as const;

export const submitReviewSchema = z.object({
  orderId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  productIds: z.array(z.string().min(1)).max(20).default([]),
  tags: z.array(z.enum(TAG_OPTIONS)).max(TAG_OPTIONS.length).default([]),
  comment: z.string().trim().max(500).optional(),
  anonymous: z.boolean().default(false),
});

export type SubmitReviewInput = z.infer<typeof submitReviewSchema>;

export const submitSurveySchema = z.object({
  orderId: z.string().min(1),
  taste: z.enum(TASTE_OPTIONS),
  speed: z.enum(SPEED_OPTIONS),
  packaging: z.enum(PACKAGING_OPTIONS),
});

export type SubmitSurveyInput = z.infer<typeof submitSurveySchema>;
