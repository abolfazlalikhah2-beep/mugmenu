import { FEATURE_MATRIX, type FeatureKey, type PlanKey } from "@/features/plans/feature-matrix";
import { FEATURE_LABELS } from "@/features/plans/feature-labels";

const COLUMNS: { key: PlanKey; label: string; emoji: string }[] = [
  { key: "menu-display", label: "منو دیداری", emoji: "👀" },
  { key: "menu-order", label: "منو سفارش", emoji: "🧾" },
  { key: "menu-advanced", label: "منو پیشرفته", emoji: "🚀" },
];

// A curated subset of features/plans/feature-matrix.ts — full enough to show
// real plan differences without reproducing all 30 gated feature keys here.
const ROWS: FeatureKey[] = [
  "menu.core",
  "domain.subdomain",
  "domain.custom",
  "product.crud",
  "order.three_mode",
  "order.manual_entry",
  "discount.manual_auto",
  "report.orders",
  "printer.connection",
  "loyalty.cashback",
  "payment.gateway",
  "branch.count",
  "branch.multi_switcher",
  "sms.panel",
  "support.ticketing",
];

function formatLimit(key: FeatureKey, value: string): string {
  switch (key) {
    case "branch.count":
      return `${Number(value).toLocaleString("fa-IR")} شعبه`;
    case "printer.connection":
      return value === "unlimited" ? "نامحدود" : `${Number(value).toLocaleString("fa-IR")} دستگاه`;
    case "support.ticketing":
      return value === "ticketing+phone" ? "تیکتینگ + تلفنی" : "تیکتینگ";
    default:
      return value;
  }
}

function Cell({ featureKey, planKey }: { featureKey: FeatureKey; planKey: PlanKey }) {
  const value = FEATURE_MATRIX[featureKey][planKey];

  if (value === undefined) {
    return (
      <span aria-hidden="true" className="text-lg text-text-3">
        —
      </span>
    );
  }

  if (value === null) {
    return (
      <span aria-label="شامل می‌شود" className="mx-auto flex h-6.5 w-6.5 items-center justify-center rounded-full bg-brand/12 text-brand">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }

  return <span className="text-[13.5px] font-medium text-ink">{formatLimit(featureKey, value)}</span>;
}

export function PricingComparisonTable() {
  return (
    <section aria-labelledby="comparison-heading" className="px-5 py-17.5">
      <div className="mx-auto max-w-[1160px]">
        <div className="mx-auto max-w-[52ch] text-center">
          <span className="inline-flex items-center gap-2 rounded-pill bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            مقایسه کامل
          </span>
          <h2
            id="comparison-heading"
            className="mt-4.5 text-[clamp(1.6rem,4vw,2.4rem)] font-bold leading-[1.4] tracking-[-0.4px] text-ink"
          >
            مقایسه‌ی کامل امکانات پلن‌ها
          </h2>
          <p className="mt-3 text-sm font-light text-text-2">در موبایل جدول را به‌صورت افقی اسکرول کنید.</p>
        </div>

        <div className="mt-9 overflow-x-auto rounded-card-sm border border-border-line bg-card shadow-float">
          <table className="w-full min-w-160 border-collapse text-right">
            <thead>
              <tr className="bg-chip">
                <th scope="col" className="sticky right-0 min-w-45 bg-chip px-5 py-4.5 text-sm font-medium text-ink">
                  امکانات
                </th>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={`px-4 py-4.5 text-center text-sm ${
                      col.key === "menu-order" ? "bg-brand/8 font-bold text-brand" : "font-medium text-text-1"
                    }`}
                  >
                    {col.emoji} {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-line">
              {ROWS.map((key, i) => (
                <tr key={key} className={i % 2 ? "bg-[#fbfdfb]" : "bg-card"}>
                  <th
                    scope="row"
                    className={`sticky right-0 px-5 py-4 text-right text-sm font-medium text-text-1 ${i % 2 ? "bg-[#fbfdfb]" : "bg-card"}`}
                  >
                    {FEATURE_LABELS[key]}
                  </th>
                  {COLUMNS.map((col) => (
                    <td key={col.key} className={`px-4 py-4 text-center ${col.key === "menu-order" ? "bg-brand/4" : ""}`}>
                      <Cell featureKey={key} planKey={col.key} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
