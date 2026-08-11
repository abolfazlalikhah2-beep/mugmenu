"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FeedbackChip } from "@/components/menu/feedback-chip";
import { submitSurveyAction } from "@/features/menu/routes/actions";
import { TASTE_OPTIONS, SPEED_OPTIONS, PACKAGING_OPTIONS } from "@/features/menu/services/review-schemas";
import {
  menuCopy,
  answeredOfLabel,
  TASTE_LABEL,
  SPEED_LABEL,
  PACKAGING_LABEL,
  type MenuLang,
} from "@/features/menu/utils/menu-language";

type Answers = Partial<Record<"taste" | "speed" | "packaging", string>>;

/** Dismissible bottom sheet shown on the receipt page right after checkout — Customer Feedback.dc.html's "نظرسنجی کوتاه روی صفحه رسید" frame. */
export function SurveySheet({ orderId, lang = "fa" }: { orderId: string; lang?: MenuLang }) {
  const [open, setOpen] = React.useState(true);
  const [answers, setAnswers] = React.useState<Answers>({});
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);
  const t = menuCopy(lang);

  const QUESTIONS = [
    { key: "taste" as const, title: t.tasteQuestion, options: TASTE_OPTIONS, labels: TASTE_LABEL[lang] },
    { key: "speed" as const, title: t.speedQuestion, options: SPEED_OPTIONS, labels: SPEED_LABEL[lang] },
    { key: "packaging" as const, title: t.packagingQuestion, options: PACKAGING_OPTIONS, labels: PACKAGING_LABEL[lang] },
  ];

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
            <div className="text-[16.5px] font-semibold">{t.surveyTitle}</div>
            <div className="mt-1 text-[12.5px] font-light text-text-3">{t.surveySubtitle}</div>
          </div>
          <span className="whitespace-nowrap rounded-lg bg-brand/10 px-2.5 py-1.5 text-xs font-medium text-brand">
            {answeredOfLabel(lang, answeredCount)}
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
            {pending ? t.submittingReview : t.submitAnswers}
          </Button>
          <Button variant="secondary" onClick={() => setOpen(false)} className="w-[100px]">
            {t.dismiss}
          </Button>
        </div>
      </div>
    </div>
  );
}
