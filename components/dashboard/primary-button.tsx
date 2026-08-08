import type { ButtonHTMLAttributes } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function PrimaryButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-[42px] items-center gap-2 rounded-[13px] bg-brand px-[18px] text-sm font-medium text-white",
        className
      )}
      {...props}
    >
      <Plus size={17} />
      {children}
    </button>
  );
}
