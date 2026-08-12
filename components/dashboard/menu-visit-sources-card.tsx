import { SOURCE_LABEL, type SourceSlice, type VisitSource } from "@/features/dashboard/services/menu-analytics-aggregation";

const SOURCE_COLOR: Record<VisitSource, string> = { QR: "#328C3D", LINK: "#2563EB", DIRECT: "#B7791F" };

function donutArc(cx: number, cy: number, r: number, startAngle: number, sweep: number) {
  const largeArc = sweep > 180 ? 1 : 0;
  const a1 = (startAngle * Math.PI) / 180;
  const a2 = ((startAngle + sweep) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  const x2 = cx + r * Math.cos(a2);
  const y2 = cy + r * Math.sin(a2);
  return `M${x1} ${y1} A${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

/** Cumulative-angle arc segments for the donut, one per source with a nonzero count. */
function buildDonutArcs(sources: SourceSlice[], cx: number, cy: number, r: number) {
  const total = sources.reduce((sum, s) => sum + s.count, 0);
  const arcs: { source: VisitSource; d: string }[] = [];
  let angle = -90;
  for (const s of sources) {
    if (s.count === 0) continue;
    const sweep = (s.count / total) * 360;
    arcs.push({ source: s.source, d: donutArc(cx, cy, r, angle, sweep) });
    angle += sweep;
  }
  return arcs;
}

export function MenuVisitSourcesCard({ sources }: { sources: SourceSlice[] }) {
  const size = 110;
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const total = sources.reduce((sum, s) => sum + s.count, 0);
  const arcs = buildDonutArcs(sources, cx, cy, r);

  return (
    <div className="flex flex-col gap-4 rounded-[22px] bg-card p-[20px_18px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)] sm:p-[24px_26px]">
      <div>
        <div className="text-[15px] font-semibold sm:text-base">منابع ورودی</div>
        <div className="mt-0.5 text-xs font-light text-text-3">از کجا وارد منو شده‌اند</div>
      </div>
      <div className="flex items-center gap-5">
        {total > 0 ? (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
            {arcs.map((a) => (
              <path key={a.source} d={a.d} fill="none" stroke={SOURCE_COLOR[a.source]} strokeWidth={size * 0.14} strokeLinecap="round" />
            ))}
          </svg>
        ) : (
          <div style={{ width: size, height: size }} className="shrink-0 rounded-full border-[10px] border-[#F0F0F0]" />
        )}
        <div className="flex flex-1 flex-col gap-2.5">
          {sources.map((s) => (
            <div key={s.source} className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 shrink-0 rounded-[4px]" style={{ background: SOURCE_COLOR[s.source] }} />
              <span className="min-w-0 flex-1 truncate text-[13px] text-[#5F5F5F]">{SOURCE_LABEL[s.source]}</span>
              <span className="font-mont shrink-0 text-[13px] font-semibold text-[#333]">
                {s.percent.toLocaleString("fa-IR")}٪
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
