import { TrendBarList } from "@/components/dashboard/trend-bar-list";
import type { TrendPoint } from "@/features/dashboard/services/menu-analytics-aggregation";

export function MenuWeeklyVisitsCard({ weekly }: { weekly: TrendPoint[] }) {
  return <TrendBarList points={weekly} title="بازدید هفتگی" subtitle="مقایسه ۷ روز اخیر" />;
}
