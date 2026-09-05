"use client";

import Link from "next/link";
import { useState } from "react";

export interface PricingPlanCard {
  key: string;
  name: string;
  description: string;
  monthlyPrice: number;
  sixMonthPrice: number;
  annualPrice: number;
  marketingFeatures: string[];
  emoji: string;
  recommended: boolean;
  freeTrial: boolean;
}

type BillingTab = "monthly" | "sixMonth" | "annual";

const TABS: { key: BillingTab; label: string }[] = [
  { key: "monthly", label: "ماهانه" },
  { key: "sixMonth", label: "۶ ماهه" },
  { key: "annual", label: "سالانه" },
];

const UNIT_LABEL: Record<BillingTab, string> = {
  monthly: "هزار تومان / ماه",
  sixMonth: "هزار تومان / ۶ ماه",
  annual: "هزار تومان / سال",
};

function priceFor(plan: PricingPlanCard, tab: BillingTab) {
  if (tab === "monthly") return plan.monthlyPrice;
  if (tab === "sixMonth") return plan.sixMonthPrice;
  return plan.annualPrice;
}

export function PricingPlansTabs({ plans }: { plans: PricingPlanCard[] }) {
  const [tab, setTab] = useState<BillingTab>("sixMonth");
  const isPurchasable = tab !== "monthly";

  return (
    <div>
      <div className="mx-auto flex w-fit items-center gap-1.25 rounded-pill border border-[#e7ece7] bg-card p-1.25 shadow-float">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            aria-pressed={tab === t.key}
            className={`inline-flex items-center rounded-pill px-4.5 py-2 text-[13px] font-medium transition-colors ${
              tab === t.key ? "bg-brand text-white" : "bg-transparent text-text-1"
            }`}
          >
            {t.label}
            {t.key === "annual" && (
              <span
                className={`mr-1.5 rounded-pill px-1.75 py-0.5 text-[10px] ${
                  tab === "annual" ? "bg-white/20 text-white" : "bg-brand/14 text-brand"
                }`}
              >
                بیشترین صرفه
              </span>
            )}
          </button>
        ))}
      </div>

      <p className="mx-auto mt-3 max-w-[46ch] text-center text-[12.5px] font-light text-text-2">
        حداقل خرید اشتراک ۶ ماهه است؛ نمایش پلن ماهانه صرفاً برای مقایسه قیمت است.
      </p>

      <div className="mt-9 grid items-stretch gap-5 [grid-template-columns:repeat(auto-fit,minmax(270px,1fr))]">
        {plans.map((plan) => {
          const priceInThousands = Math.round(priceFor(plan, tab) / 1000);

          return (
            <div
              key={plan.key}
              className={`relative flex flex-col rounded-card-sm border p-6.5 ${
                plan.recommended
                  ? "border-brand bg-card shadow-modal md:-translate-y-3"
                  : "border-border-line bg-card shadow-float"
              }`}
            >
              {plan.recommended && (
                <span className="absolute -top-3.25 right-1/2 translate-x-1/2 whitespace-nowrap rounded-pill bg-brand px-3.5 py-1.25 text-[11px] font-medium text-white shadow-[0_8px_17.5px_rgba(50,140,61,0.28)]">
                  پیشنهادی
                </span>
              )}
              {plan.freeTrial && (
                <span className="absolute -top-3.25 left-4 whitespace-nowrap rounded-pill bg-star px-3 py-1.25 text-[11px] font-medium text-ink shadow-float">
                  ۱ ماه رایگان
                </span>
              )}

              <div className="text-base font-bold text-ink">
                {plan.emoji} {plan.name}
              </div>
              <p className="mt-1.5 text-[13px] font-light text-text-1">{plan.description}</p>

              <div className="my-5 flex items-baseline gap-1.5">
                <span className="text-[1.6rem] font-bold text-brand">{priceInThousands.toLocaleString("fa-IR")}</span>
                <span className="text-[12.5px] font-light text-text-2">{UNIT_LABEL[tab]}</span>
              </div>

              <ul className="flex flex-col gap-2.5">
                {plan.marketingFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.25 text-[13px] font-light text-text-1">
                    <span aria-hidden="true" className="mt-0.5 flex h-4.5 w-4.5 flex-none items-center justify-center rounded-full bg-brand/12 text-brand">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              {isPurchasable ? (
                <Link
                  href="/register"
                  className={`mt-6.5 block rounded-btn px-5 py-3 text-center text-[13.5px] font-medium transition-colors ${
                    plan.recommended
                      ? "bg-brand text-white shadow-[0_8px_17.5px_rgba(50,140,61,0.28)] hover:bg-brand-hover"
                      : "border-[1.5px] border-brand/22 bg-white text-brand hover:bg-brand/5"
                  }`}
                >
                  انتخاب پلن
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  title="پلن ماهانه فقط نمایشی است؛ حداقل خرید ۶ ماهه"
                  className="mt-6.5 block cursor-not-allowed rounded-btn border-[1.5px] border-border-line bg-chip px-5 py-3 text-center text-[13.5px] font-medium text-text-3"
                >
                  فقط نمایشی
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
