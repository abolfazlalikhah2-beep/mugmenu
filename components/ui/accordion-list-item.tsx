import * as React from "react";
import { cn } from "@/lib/utils";

function ChevronDownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 9l6 6 6-6"
        stroke="#747474"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface AccordionListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  icon?: React.ReactNode;
  muted?: boolean;
}

function AccordionListItem({
  label,
  icon,
  muted,
  className,
  ...props
}: AccordionListItemProps) {
  return (
    <div
      className={cn(
        "flex h-12 items-center rounded-btn bg-chip px-5",
        muted && "opacity-70",
        className
      )}
      {...props}
    >
      <ChevronDownIcon />
      <span className="mr-auto text-[15px] font-light">{label}</span>
      {icon}
    </div>
  );
}

export { AccordionListItem };
