import { cn } from "@/lib/utils";
import type { TopProductRow } from "@/features/dashboard/services/report-aggregation";

const RANK_COLORS = ["#F5B301", "#B9C2CC", "#CD8B4E"];

export function ProductReportRow({
  product,
  rank,
  maxSold,
}: {
  product: TopProductRow;
  rank: number;
  maxSold: number;
}) {
  const top = rank < 3;

  return (
    <div className={cn("flex items-center gap-3 py-3 sm:gap-4 sm:px-3 sm:py-4", rank > 0 && "border-t border-[#F4F4F4]")}>
      <div
        className={cn(
          "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-sm font-bold sm:h-[34px] sm:w-[34px]",
          top ? "text-white" : "bg-[#F2F2F2] text-[#9A9A9A]"
        )}
        style={top ? { background: RANK_COLORS[rank] } : undefined}
      >
        {(rank + 1).toLocaleString("fa-IR")}
      </div>

      <div className="relative h-[46px] w-[46px] shrink-0 overflow-hidden rounded-[13px] bg-[#F2F2F2] sm:h-[52px] sm:w-[52px]">
        {product.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- Liara's proxy 400s /_next/image
          <img src={product.imageUrl} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium sm:text-[15px]">{product.name}</span>
          <span className="shrink-0 text-[13px] font-semibold text-brand sm:text-sm">
            {product.sold.toLocaleString("fa-IR")}
            <span className="mr-1 text-[11px] font-light text-text-3">فروش</span>
          </span>
        </div>
        <div className="h-[7px] overflow-hidden rounded-full bg-[#F0F2F0]">
          <div
            className={cn("h-full rounded-full", top ? "bg-brand" : "bg-[#CDE6D0]")}
            style={{ width: `${maxSold > 0 ? (product.sold / maxSold) * 100 : 0}%` }}
          />
        </div>
      </div>

      <span className="hidden shrink-0 rounded-[9px] border-[0.3px] border-border-chip bg-chip px-3 py-[5px] text-xs font-light text-text-3 sm:inline-block">
        {product.category}
      </span>
    </div>
  );
}
