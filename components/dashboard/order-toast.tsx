"use client";

import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";

export interface OrderToastItem {
  id: string;
  count: number;
}

const AUTO_DISMISS_MS = 8000;

function ToastCard({ toast, onDismiss }: { toast: OrderToastItem; onDismiss: (id: string) => void }) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    // Mount transform-out then flip on the next frame so the CSS transition
    // actually animates the slide-in instead of snapping straight to place.
    const raf = requestAnimationFrame(() => setEntered(true));
    const dismissTimer = setTimeout(() => onDismiss(toast.id), AUTO_DISMISS_MS);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(dismissTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally fires once per toast.id, not on onDismiss identity churn
  }, [toast.id]);

  return (
    <div
      role="status"
      className="flex w-[300px] items-center gap-3 rounded-2xl p-4 text-white shadow-[0_12px_30px_rgba(50,140,61,0.35)] transition-all duration-300 ease-out"
      style={{
        background: "#328C3D",
        transform: entered ? "translateX(0)" : "translateX(120%)",
        opacity: entered ? 1 : 0,
      }}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
        <Bell size={20} />
      </div>
      <div className="flex-1 text-right">
        <div className="text-sm font-semibold">سفارش جدید ثبت شد</div>
        {toast.count > 1 && (
          <div className="mt-0.5 text-xs font-light text-white/85">{toast.count.toLocaleString("fa-IR")} سفارش جدید</div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="بستن اعلان"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white/80 hover:bg-white/15 hover:text-white"
      >
        <X size={16} />
      </button>
    </div>
  );
}

/**
 * Stacked new-order toasts, fixed to the bottom-right corner. This app is
 * always dir="rtl" (no LTR mode), so the physical "right" here is the
 * correct/intentional corner per the design spec — not a logical-property
 * oversight.
 */
export function OrderToastStack({ toasts, onDismiss }: { toasts: OrderToastItem[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null;
  return (
    <div dir="rtl" className="fixed bottom-5 right-5 z-[9999] flex flex-col-reverse gap-3">
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
