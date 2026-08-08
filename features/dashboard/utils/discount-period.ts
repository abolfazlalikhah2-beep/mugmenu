export function formatDiscountPeriod(
  startDate: Date | string | null,
  endDate: Date | string | null
): string {
  if (!startDate && !endDate) return "بدون محدودیت";
  const fmt = (d: Date | string) =>
    new Date(d).toLocaleDateString("fa-IR", { day: "2-digit", month: "long" });
  if (startDate && endDate) return `${fmt(startDate)} تا ${fmt(endDate)}`;
  if (startDate) return `از ${fmt(startDate)}`;
  return `تا ${fmt(endDate as Date | string)}`;
}
