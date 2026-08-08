import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PanelContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex-1 overflow-y-auto p-[30px_34px]", className)}>{children}</div>;
}
