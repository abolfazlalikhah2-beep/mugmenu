export function formatOpeningHours(start: string | null, end: string | null): string | null {
  if (!start || !end) return null;
  return `امروز از ساعت ${start} تا ${end}`;
}
