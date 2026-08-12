import { TrendLineChart } from "@/components/dashboard/trend-line-chart";
import type { TrendPoint } from "@/features/dashboard/services/menu-analytics-aggregation";

export function MenuVisitTrendChart({ points }: { points: TrendPoint[] }) {
  return (
    <TrendLineChart
      points={points}
      title="روند بازدید — ۱۴ روز اخیر"
      subtitle="بازدید یکتا منوی آنلاین"
      legendLabel="بازدید"
      gradientId="menuVisitTrendFill"
    />
  );
}
