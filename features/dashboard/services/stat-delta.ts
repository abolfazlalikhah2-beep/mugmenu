/** Pure — no I/O — so it's trivial to unit test the today-vs-yesterday math. */
export interface StatDelta {
  deltaPercent: number;
  up: boolean;
}

export function computeDelta(today: number, yesterday: number): StatDelta {
  if (yesterday === 0) {
    return { deltaPercent: today > 0 ? 100 : 0, up: today >= yesterday };
  }
  const diff = ((today - yesterday) / yesterday) * 100;
  return { deltaPercent: Math.round(Math.abs(diff)), up: diff >= 0 };
}
