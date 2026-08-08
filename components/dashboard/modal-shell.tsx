"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

export function ModalShell({
  title,
  subtitle,
  onClose,
  maxWidth = 680,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  maxWidth?: number;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/28 p-6 md:p-10"
      onClick={onClose}
    >
      <div
        className="flex max-h-full w-full flex-col overflow-hidden rounded-card bg-card shadow-modal"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#F0F0F0] p-[26px_34px]">
          <div className="text-right">
            <div className="text-xl font-semibold">{title}</div>
            {subtitle && <div className="mt-1 text-[13px] font-light text-text-3">{subtitle}</div>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-[#F4F5F4]"
          >
            <X size={20} className="text-[#8A8A8A]" />
          </button>
        </div>
        <div className="flex flex-col gap-[18px] overflow-auto p-[24px_34px]">{children}</div>
        {footer && <div className="flex gap-3 border-t border-[#F0F0F0] p-[18px_34px_22px]">{footer}</div>}
      </div>
    </div>
  );
}
