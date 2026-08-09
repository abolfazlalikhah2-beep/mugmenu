function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function timeLabel(d: Date) {
  return d.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit", hour12: false });
}

/** "امروز · HH:MM" / "دیروز · HH:MM" / "D MMMM · HH:MM" (Persian calendar). */
export function formatRelativeDateTime(date: Date, now: Date = new Date()): string {
  const time = timeLabel(date);
  if (isSameDay(date, now)) return `امروز · ${time}`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) return `دیروز · ${time}`;

  const day = date.toLocaleDateString("fa-IR", { day: "numeric", month: "long" });
  return `${day} · ${time}`;
}
