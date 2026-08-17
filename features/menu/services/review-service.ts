import "server-only";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/internal/prismaNamespace";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import * as repo from "@/features/menu/repositories/menu-repository";
import { submitReviewSchema, submitSurveySchema } from "@/features/menu/services/review-schemas";
import { awardReviewPoints } from "@/features/customer/services/wallet-service";

export type SubmitReviewResult =
  | { ok: true; pointsAwarded: number }
  | { ok: false; error: string };

const REVIEW_SUBMIT_IP_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 }; // 5 reviews / hour / IP

export async function submitReview(input: unknown): Promise<SubmitReviewResult> {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`review-submit:${ip}`, REVIEW_SUBMIT_IP_LIMIT);
  if (!allowed) {
    logger.warn("review.rate_limited", { ip });
    return { ok: false, error: "تعداد ثبت نظر بیش از حد مجاز است. کمی بعد دوباره تلاش کنید." };
  }

  const parsed = submitReviewSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  const order = await repo.getOrder(data.orderId);
  if (!order) return { ok: false, error: "سفارش پیدا نشد." };
  if (order.reviews.length > 0) return { ok: false, error: "برای این سفارش قبلاً نظر ثبت شده است." };

  try {
    await repo.createReviews({
      businessId: order.businessId,
      orderId: order.id,
      customerName: order.customerName,
      anonymous: data.anonymous,
      rating: data.rating,
      comment: data.comment,
      tags: data.tags,
      productIds: data.productIds,
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
      return { ok: false, error: "شما قبلاً برای یکی از این آیتم‌ها نظر ثبت کرده‌اید." };
    }
    throw err;
  }

  const pointsAwarded = order.customerAccountId
    ? await awardReviewPoints(order.customerAccountId, order.id)
    : 0;

  logger.info("review.submitted", {
    orderId: order.id,
    businessId: order.businessId,
    rating: data.rating,
    productCount: data.productIds.length,
    pointsAwarded,
  });
  return { ok: true, pointsAwarded };
}

export type SubmitSurveyResult = { ok: true } | { ok: false; error: string };

export async function submitSurvey(input: unknown): Promise<SubmitSurveyResult> {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`survey-submit:${ip}`, REVIEW_SUBMIT_IP_LIMIT);
  if (!allowed) {
    logger.warn("review.survey_rate_limited", { ip });
    return { ok: false, error: "تعداد ثبت نظرسنجی بیش از حد مجاز است. کمی بعد دوباره تلاش کنید." };
  }

  const parsed = submitSurveySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  const order = await repo.getOrder(data.orderId);
  if (!order) return { ok: false, error: "سفارش پیدا نشد." };

  await repo.upsertOrderSurvey(data);
  logger.info("review.survey_submitted", { orderId: order.id, businessId: order.businessId });
  return { ok: true };
}
