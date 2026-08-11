"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FeedbackChip } from "@/components/menu/feedback-chip";
import { submitSurveyAction } from "@/features/menu/routes/actions";
import { TASTE_OPTIONS, SPEED_OPTIONS, PACKAGING_OPTIONS } from "@/features/menu/services/review-schemas";

const TASTE_LABEL: Record<string, string> = { EXCELLENT: "عالی", GOOD: "خوب", AVERAGE: "متوسط", POOR: "ضعیف" };
const SPEED_LABEL: Record<string, string> = {
  EARLY: "زودتر از انتظار",
  ON_TIME: "به‌موقع",
  LATE: "کمی دیر",
  VERY_LATE: "خیلی دیر",
};
const PACKAGING_LABEL: Record<string, string> = { NEAT: "مرتب و سالم", ACCEPTABLE: "قابل قبول", POOR: "نامناسب" };

const QUESTIONS = [
  { key: "taste" as const, title: "کیفیت غذا چطور بود؟", options: TASTE_OPTIONS, labels: TASTE_LABEL },
  { key: "speed" as const, title: "سرعت تحویل چطور بود؟", options: SPEED_OPTIONS, labels: SPEED_LABEL },
  {
    key: "packaging" as const,
    title: "بسته‌بندی سفارش چطور بود؟",
    options: PACKAGING_OPTIONS,
    labels: PACKAGING_LABEL,
  },
];

type Answers = Partial<Record<(typeof QUESTIONS)[number]["key"], string>>;

/** Dismissible bottom sheet shown on the receipt page right after checkout — Customer Feedback.dc.html's "نظرسنجی کوتاه روی صفحه رسید" frame. */
export function SurveySheet({ orderId }: { orderId: string }) {
  const [open, setOpen] = React.useState(true);
  const [answers, setAnswers] = React.useState<Answers>({});
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);

  if (!open || done) return null;

  const answeredCount = Object.values(answers).filter(Boolean).length;

  async function handleSubmit() {
    if (!answers.taste || !answers.speed || !answers.packaging) return;
    setPending(true);
    setError(null);
    const result = await submitSurveyAction({
      orderId,
      taste: answers.taste,
      speed: answers.speed,
      packaging: answers.packaging,
    });
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDone(true);
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/22 md:items-center"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-[520px] rounded-t-[28px] bg-card p-5 pb-6 shadow-modal md:rounded-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[16.5px] font-semibold">۳ سوال کوتاه، ۲۰ ثانیه</div>
            <div className="mt-1 text-[12.5px] font-light text-text-3">
              اختیاری · به بهتر شدن سرویس کمک می‌کند
            </div>
          </div>
          <span className="whitespace-nowrap rounded-lg bg-brand/10 px-2.5 py-1.5 text-xs font-medium text-brand">
            {answeredCount} از ۳
          </span>
        </div>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#F0F0F0]">
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{ width: `${(answeredCount / 3) * 100}%` }}
          />
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {QUESTIONS.map((q, i) => (
            <div
              key={q.key}
              className={cn("flex flex-col gap-2.5", i > 0 && "border-t border-[#F4F4F4] pt-4")}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px] font-semibold",
                    answers[q.key] ? "bg-brand text-white" : "bg-[#F0F0F0] text-text-3"
                  )}
                >
                  {i + 1}
                </span>
                <span className="text-[14.5px] font-medium">{q.title}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt) => (
                  <FeedbackChip
                    key={opt}
                    selected={answers[q.key] === opt}
                    onClick={() => setAnswers((prev) => ({ ...prev, [q.key]: opt }))}
                  >
                    {q.labels[opt]}
                  </FeedbackChip>
                ))}
              </div>
            </div>
          ))}
        </div>

        {error && <p className="mt-3 text-right text-xs text-red-500">{error}</p>}

        <div className="mt-4 flex gap-2.5">
          <Button
            variant="primary"
            disabled={answeredCount < 3 || pending}
            onClick={handleSubmit}
            className="flex-1"
          >
            {pending ? "در حال ثبت…" : "ثبت پاسخ‌ها"}
          </Button>
          <Button variant="secondary" onClick={() => setOpen(false)} className="w-[100px]">
            رد کردن
          </Button>
        </div>
      </div>
    </div>
  );
}
