"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input, type InputProps } from "@/components/ui/input";

const PasswordInput = React.forwardRef<HTMLInputElement, Omit<InputProps, "type" | "icon">>(
  (props, ref) => {
    const [visible, setVisible] = React.useState(false);
    return (
      <Input
        ref={ref}
        type={visible ? "text" : "password"}
        icon={
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="text-[#AAAAAA]"
            aria-label={visible ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
          >
            {visible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        }
        {...props}
      />
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
