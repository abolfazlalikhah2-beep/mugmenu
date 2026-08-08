import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:bg-disabled disabled:text-white",
  {
    variants: {
      variant: {
        primary:
          "h-[50px] rounded-btn bg-brand text-white text-lg font-normal hover:bg-brand-hover",
        secondary:
          "h-[50px] rounded-btn border border-border-input bg-card text-brand text-base font-normal",
        chip: "h-[34px] rounded-chip border-[0.3px] border-border-chip bg-chip text-ink text-sm px-5",
        chipMuted: "h-[34px] rounded-chip bg-chip text-[#777] text-xs opacity-65 px-5",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
