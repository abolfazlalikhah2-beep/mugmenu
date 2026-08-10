import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/generated/prisma/enums";

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "NEW", label: "ثبت سفارش" },
  { key: "PREPARING", label: "در حال آماده‌سازی" },
  { key: "READY", label: "آماده تحویل" },
  { key: "DELIVERED", label: "تحویل شد" },
];
const ORDER_INDEX: Record<OrderStatus, number> = { NEW: 0, PREPARING: 1, READY: 2, DELIVERED: 3, CANCELED: -1 };

export function OrderStatusTimeline({
  status,
  createdAtLabel,
  updatedAtLabel,
}: {
  status: OrderStatus;
  createdAtLabel: string;
  updatedAtLabel: string;
}) {
  if (status === "CANCELED") {
    return (
      <div className="rounded-2xl border border-[#F0DADA] bg-[#FBECEC] p-4 text-center text-sm text-[#C15656]">
        این سفارش لغو شده است
      </div>
    );
  }

  const currentIndex = ORDER_INDEX[status];

  return (
    <div className="flex flex-col">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const isLast = i === STEPS.length - 1;
        const isCurrent = i === currentIndex;
        return (
          <div key={step.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-[22px] w-[22px] items-center justify-center rounded-full",
                  done ? "bg-brand" : "bg-[#EAEAEA]"
                )}
              >
                {done && <Check size={13} strokeWidth={2.6} className="text-white" />}
              </div>
              {!isLast && <div className={cn("min-h-6.5 w-0.5 flex-1", done ? "bg-brand/30" : "bg-[#EAEAEA]")} />}
            </div>
            <div className={cn("pb-3.5", isLast && "pb-0")}>
              <div className={cn("text-[13.5px]", done ? "font-medium text-ink" : "font-light text-text-3")}>
                {step.label}
              </div>
              <div className="mt-0.5 text-[11.5px] font-light text-text-4">
                {i === 0 ? createdAtLabel : isCurrent ? updatedAtLabel : done ? updatedAtLabel : ""}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
