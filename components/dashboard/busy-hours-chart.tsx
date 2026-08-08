const AXIS_LABELS = ["۰", "۴", "۸", "۱۲", "۱۶", "۲۰", "۲۳"];

export function BusyHoursChart({ hours }: { hours: number[] }) {
  const max = Math.max(...hours, 1);
  const cw = 980;
  const ch = 210;
  const pad = 8;
  const bx = (i: number) => pad + i * ((cw - 2 * pad) / (hours.length - 1));
  const by = (v: number) => ch - 8 - (v / max) * (ch - 26);

  const linePath = hours.map((v, i) => `${i ? "L" : "M"}${bx(i).toFixed(1)} ${by(v).toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${bx(hours.length - 1).toFixed(1)} ${ch - 4} L${bx(0).toFixed(1)} ${ch - 4} Z`;

  const peakIdx = [...hours.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([i]) => i);

  return (
    <div className="flex flex-col gap-3.5 rounded-[22px] bg-card p-[24px_28px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between">
        <div className="text-[17px] font-semibold">زمان شلوغی این ماه</div>
        <div className="flex items-center gap-1.5">
          <span className="h-[11px] w-[11px] rounded-full bg-brand" />
          <span className="text-[13px] text-[#777]">تعداد سفارش</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${cw} ${ch}`} className="h-[210px] w-full overflow-visible">
        <defs>
          <linearGradient id="busyfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#328C3D" stopOpacity={0.22} />
            <stop offset="100%" stopColor="#328C3D" stopOpacity={0} />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((g, i) => (
          <line key={i} x1={pad} x2={cw - pad} y1={by(max * g)} y2={by(max * g)} stroke="#F0F0F0" strokeWidth={1} />
        ))}
        <path d={areaPath} fill="url(#busyfill)" />
        <path d={linePath} fill="none" stroke="#328C3D" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {peakIdx.map((i, k) => (
          <circle key={k} cx={bx(i)} cy={by(hours[i])} r={4.5} fill="#fff" stroke="#328C3D" strokeWidth={2.5} />
        ))}
      </svg>
      <div className="flex justify-between px-0.5">
        {AXIS_LABELS.map((t, i) => (
          <span key={i} className="text-[11px] text-[#B0B0B0]">
            {t}:۰۰
          </span>
        ))}
      </div>
    </div>
  );
}
