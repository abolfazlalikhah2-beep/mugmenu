import type { TrendPoint } from "@/features/dashboard/services/menu-analytics-aggregation";

export function TrendLineChart({
  points,
  title,
  subtitle,
  legendLabel,
  gradientId,
}: {
  points: TrendPoint[];
  title: string;
  subtitle: string;
  legendLabel: string;
  gradientId: string;
}) {
  const counts = points.map((p) => p.count);
  const max = Math.max(...counts, 1);
  const min = Math.min(...counts, 0);
  const range = max - min || 1;
  const W = 100;
  const H = 40;
  const stepX = points.length > 1 ? W / (points.length - 1) : 0;
  const coords = points.map((p, i) => [i * stepX, H - ((p.count - min) / range) * H] as const);
  const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const last = coords[coords.length - 1];
  const area = last ? `${line} L${last[0]},${H} L0,${H} Z` : "";

  return (
    <div className="flex flex-col gap-3 rounded-[22px] bg-card p-[20px_18px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)] sm:p-[26px_30px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[15px] font-semibold sm:text-base">{title}</div>
          <div className="mt-0.5 text-xs font-light text-text-3">{subtitle}</div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-[3px] w-2.5 rounded-sm bg-brand" />
          <span className="text-[11px] text-text-3">{legendLabel}</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-[170px] w-full sm:h-[200px]">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#328C3D" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#328C3D" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gradientId})`} />
        <path
          d={line}
          fill="none"
          stroke="#328C3D"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex justify-between text-[10px] text-text-3 sm:text-xs">
        <span>{points[0]?.label}</span>
        <span>{points[Math.floor(points.length / 2)]?.label}</span>
        <span>{points[points.length - 1]?.label}</span>
      </div>
    </div>
  );
}
