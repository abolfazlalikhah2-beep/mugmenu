import * as React from "react";
import { cn } from "@/lib/utils";

function StarIcon({ size = 13, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#FACB0F" className={className}>
      <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2Z" />
    </svg>
  );
}

function InfoCircleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#747474" strokeWidth="1.4" />
      <path d="M12 11v5" stroke="#747474" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill="#747474" />
    </svg>
  );
}

export interface RatingChipProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number | string;
}

function RatingChip({ rating, className, ...props }: RatingChipProps) {
  return (
    <div
      className={cn(
        "flex h-[30px] w-fit items-center gap-2 rounded-chip border-[0.3px] border-border-chip bg-chip px-3.5",
        className
      )}
      {...props}
    >
      <span className="text-xs text-text-2">{rating}</span>
      <StarIcon />
    </div>
  );
}

export interface InfoRatingPillProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number | string;
  label: string;
}

function InfoRatingPill({ rating, label, className, ...props }: InfoRatingPillProps) {
  return (
    <div
      className={cn(
        "flex h-[31px] w-fit items-center gap-3 rounded-pill bg-card px-3.5 shadow-float",
        className
      )}
      {...props}
    >
      <StarIcon size={14} />
      <span className="text-sm text-text-2">{rating}</span>
      <span className="h-4 w-px bg-border-line" />
      <span className="text-xs text-text-2">{label}</span>
      <InfoCircleIcon />
    </div>
  );
}

export { StarIcon, InfoCircleIcon, RatingChip, InfoRatingPill };
