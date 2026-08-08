import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, icon, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className="text-right text-[13px] font-light text-text-4">
            {label}
          </label>
        )}
        <div className="flex h-[50px] items-center gap-2 rounded-input border border-border-input px-[18px] focus-within:border-brand">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "min-w-0 flex-1 bg-transparent text-lg text-[#797979] outline-none placeholder:text-[#797979]",
              className
            )}
            {...props}
          />
          {icon}
        </div>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
