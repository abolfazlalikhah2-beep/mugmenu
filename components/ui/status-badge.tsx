import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: "online" | "offline";
  label?: string;
}

const DEFAULT_LABEL: Record<StatusBadgeProps["status"], string> = {
  online: "سفارش می‌پذیریم",
  offline: "فعلاً بسته است",
};

function StatusBadge({ status, label, className, ...props }: StatusBadgeProps) {
  const isOnline = status === "online";
  return (
    <div className={cn("flex items-center gap-2.5", className)} {...props}>
      <span className="relative inline-flex h-4 w-4 items-center justify-center">
        <span
          className={cn(
            "absolute inset-0 rounded-full",
            isOnline ? "bg-success/[0.19]" : "bg-text-3/[0.19]"
          )}
        />
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            isOnline ? "bg-success" : "bg-text-3"
          )}
        />
      </span>
      <span className={cn("text-xs", isOnline ? "text-success" : "text-text-3")}>
        {label ?? DEFAULT_LABEL[status]}
      </span>
    </div>
  );
}

export { StatusBadge };
