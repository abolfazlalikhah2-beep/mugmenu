"use client";

import Link from "next/link";
import { useState } from "react";
import { PLAN_KEYS, PLAN_DEFS, type PlanKey } from "@/features/plans/feature-matrix";

const EMOJI: Record<PlanKey, string> = {
  firuze: "💠",
  yashm: "💵",
  opal: "🧾",
  zomorrod: "🚀",
};

// Only opal (the flagship ordering tier) is highlighted — matches the
// comparison table's highlighted column below.
const RECOMMENDED_PLAN: PlanKey = "opal";

// Simple 20% "yearly" marketing discount shown per month (matches the
// "٪۲۰ تخفیف" badge) — not the exact annualPrice/12, which is snapshotted
// separately per plan for billing.
const YEARLY_DISCOUNT = 0.8;

export function PricingPlans() {
  const [yearly, setYearly] = useState(false);

  return (
    <div>
      <div className="mx-auto flex w-fit items-center gap-1.5 rounded-pill border border-[#e7ece7] bg-card p-1.25 shadow-float">
        <button
          type="button"
          onClick={() => setYearly(false)}
          aria-pressed={!yearly}
          className={`rounded-pill px-5 py-2.25 text-sm font-medium transition-colors ${
            !yearly ? "bg-brand text-white" : "bg-transparent text-text-1"
          }`}
        >
          ماهانه
        </button>
        <button
          type="button"
          onClick={() => setYearly(true)}
          aria-pressed={yearly}
          className={`inline-flex items-center rounded-pill px-5 py-2.25 text-sm font-medium transition-colors ${
            yearly ? "bg-brand text-white" : "bg-transparent text-text-1"
          }`}
        >
          سالانه
          <span
            className={`mr-1.5 rounded-pill px-2 py-0.5 text-[11px] ${
              yearly ? "bg-white/20 text-white" : "bg-brand/14 text-brand"
            }`}
          >
            ٪۲۰ تخفیف
          </span>
        </button>
      </div>

      <div className="mt-11 grid items-stretch gap-5.5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
        {PLAN_KEYS.map((key) => {
          const plan = PLAN_DEFS[key];
          const recommended = key === RECOMMENDED_PLAN;
          const priceInThousands = Math.round((plan.monthlyPrice * (yearly ? YEARLY_DISCOUNT : 1)) / 1000);

          return (
            <div
              key={key}
              className={`relative flex flex-col rounded-card-sm border p-7.5 ${
                recommended
                  ? "border-brand bg-card shadow-modal md:-translate-y-3"
                  : "border-border-line bg-card shadow-float"
              }`}
            >
              {recommended && (
                <span className="absolute -top-3.5 right-1/2 translate-x-1/2 whitespace-nowrap rounded-pill bg-brand px-4 py-1.5 text-xs font-medium text-white shadow-[0_8px_17.5px_rgba(50,140,61,0.28)]">
                  پیشنهادی
                </span>
              )}

              <div className="text-lg font-bold text-ink">
                {EMOJI[key]} {plan.name}
              </div>
              <p className="mt-1.5 text-sm font-light text-text-1">{plan.description}</p>

              <div className="my-5.5 flex items-baseline gap-1.5">
                <span className="text-[1.9rem] font-bold text-brand">{priceInThousands.toLocaleString("fa-IR")}</span>
                <span className="text-sm font-light text-text-2">هزار تومان / ماه</span>
              </div>

              <ul className="flex flex-col gap-3">
                {plan.marketingFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm font-light text-text-1">
                    <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand/12 text-brand">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`mt-7.5 block rounded-btn px-6 py-3.25 text-center text-sm font-medium transition-colors ${
                  recommended
                    ? "bg-brand text-white shadow-[0_8px_17.5px_rgba(50,140,61,0.28)] hover:bg-brand-hover"
                    : "border-[1.5px] border-brand/22 bg-white text-brand hover:bg-brand/5"
                }`}
              >
                انتخاب پلن
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
