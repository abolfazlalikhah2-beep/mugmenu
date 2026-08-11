"use client";

import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { StarIcon, StarRatingInput } from "@/components/ui/rating";
import { FeedbackChip } from "@/components/menu/feedback-chip";
import { submitReviewAction } from "@/features/menu/routes/actions";
import { TAG_OPTIONS } from "@/features/menu/services/review-schemas";

const RATE_LABEL: Record<number, string> = {
  1: "خیلی بد",
  2: "بد",
  3: "متوسط",
  4: "خوب",
  5: "عالی بود!",
};

export interface ReviewFormProps {
  slug: string;
  orderId: string;
  items: { productId: string; name: string }[];
  pointsEligible: boolean;
  alreadyReviewed: boolean;
}

export function ReviewForm({ slug, orderId, items, pointsEligible, alreadyReviewed }: ReviewFormProps) {
  const [submitted, setSubmitted] = React.useState(alreadyReviewed);
  const [pointsAwarded, setPointsAwarded] = React.useState(0);
  const [rating, setRating] = React.useState(0);
  const [selectedProductIds, setSelectedProductIds] = React.useState<string[]>([]);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [comment, setComment] = React.useState("");
  const [anonymous, setAnonymous] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function toggleIn<T>(list: T[], value: T): T[] {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }

  async function handleSubmit() {
    if (rating === 0) {
      setError("لطفاً امتیاز خود را انتخاب کنید.");
      return;
    }
    setError(null);
    setPending(true);
    const result = await submitReviewAction({
      orderId,
      rating,
      productIds: selectedProductIds,
      tags: selectedTags,
      comment: comment.trim() || undefined,
      anonymous,
    });
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setPointsAwarded(result.pointsAwarded);
    setSubmitted(true);
  }

  if (submitted) {
    const singleProductId = selectedProductIds.length === 1 ? selectedProductIds[0] : null;
    return (
      <div className="flex flex-col items-center gap-3.5 px-6 py-16 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#E5F0E6]">
          <Check size={46} strokeWidth={2.4} className="text-brand" />
        </div>
        <div className="text-xl font-semibold">ممنون از نظر شما</div>
        <p className="m-0 max-w-xs text-[13.5px] font-light leading-8 text-text-3">
          نظر شما بعد از بررسی روی صفحه آیتم نمایش داده می‌شود.
        </p>
        {pointsAwarded > 0 && (
          <div className="mt-1.5 flex items-center gap-2 rounded-2xl bg-star/16 px-4.5 py-3">
            <StarIcon size={18} />
            <span className="text-[13.5px] font-medium text-[#C79A00]">
              {pointsAwarded} امتیاز به حساب شما اضافه شد
            </span>
          </div>
        )}
        <div className="mt-4 flex w-full max-w-xs flex-col gap-3">
          <Link href={`/${slug}`}>
            <Button variant="primary" className="w-full">
              بازگشت به منو
            </Button>
          </Link>
          {singleProductId && (
            <Link href={`/${slug}/item/${singleProductId}/reviews`}>
              <Button variant="secondary" className="w-full">
                مشاهده نظرم
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 md:p-6.5">
      <div className="flex flex-col items-center gap-2.5 rounded-card-sm border border-[#EFEFEF] p-5">
        <span className="text-[15px] font-semibold">تجربه‌تان چطور بود؟</span>
        <StarRatingInput value={rating} onChange={setRating} />
        {rating > 0 && (
          <span
            className={
              rating >= 4 ? "text-[13px] font-medium text-brand" : rating === 3 ? "text-[13px] font-medium text-[#B7791F]" : "text-[13px] font-medium text-[#C15656]"
            }
          >
            {RATE_LABEL[rating]}
          </span>
        )}
      </div>

      {items.length > 0 && (
        <div className="flex flex-col gap-2.5 rounded-card-sm border border-[#EFEFEF] p-4.5">
          <div>
            <div className="text-sm font-semibold">نظر شما درباره کدام آیتم است؟</div>
            <div className="mt-1 text-[11.5px] font-light text-text-3">
              اختیاری · می‌توانید چند مورد را انتخاب کنید
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <FeedbackChip
                key={item.productId}
                selected={selectedProductIds.includes(item.productId)}
                onClick={() => setSelectedProductIds((prev) => toggleIn(prev, item.productId))}
              >
                {item.name}
              </FeedbackChip>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2.5 rounded-card-sm border border-[#EFEFEF] p-4.5">
        <div className="text-sm font-semibold">چه چیزی برایتان خوب بود؟</div>
        <div className="flex flex-wrap gap-2">
          {TAG_OPTIONS.map((tag) => (
            <FeedbackChip
              key={tag}
              selected={selectedTags.includes(tag)}
              onClick={() => setSelectedTags((prev) => toggleIn(prev, tag))}
            >
              {tag}
            </FeedbackChip>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 rounded-card-sm border border-[#EFEFEF] p-4.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">متن نظر</span>
          <span className="font-mont text-[11.5px] text-text-4">{comment.length} / 500</span>
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 500))}
          placeholder="تجربه‌تان را برای بقیه بنویسید؛ طعم، گرمی غذا، بسته‌بندی…"
          rows={4}
          className="min-h-[110px] resize-none rounded-input border border-border-input p-4 text-[13px] leading-8 text-text-1 outline-none placeholder:text-text-4 focus:border-brand"
        />
        <div className="flex items-center justify-between rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] px-3.5 py-3">
          <div>
            <div className="text-[13.5px] font-medium">ثبت به‌صورت ناشناس</div>
            <div className="mt-0.5 text-[11.5px] font-light text-text-3">نام شما نمایش داده نمی‌شود</div>
          </div>
          <Toggle checked={anonymous} onChange={setAnonymous} />
        </div>
      </div>

      {pointsEligible && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-brand/[0.18] bg-brand/[0.06] px-4 py-3.5">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
          <span className="text-xs font-light leading-7 text-[#3D5B41]">
            با ثبت نظر ۵۰ امتیاز باشگاه مشتریان می‌گیرید
          </span>
        </div>
      )}

      {error && <p className="text-right text-xs text-red-500">{error}</p>}

      <div className="flex gap-2.5">
        <Button variant="primary" disabled={pending} onClick={handleSubmit} className="flex-1">
          {pending ? "در حال ثبت…" : "ثبت نظر"}
        </Button>
        <Link href={`/${slug}/receipt/${orderId}`}>
          <Button variant="secondary" className="w-[110px]">
            بعداً
          </Button>
        </Link>
      </div>
    </div>
  );
}
