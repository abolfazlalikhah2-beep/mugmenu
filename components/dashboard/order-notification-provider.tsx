"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { playOrderNotificationSound } from "@/features/dashboard/client/order-notification-sound";
import { OrderToastStack, type OrderToastItem } from "@/components/dashboard/order-toast";

const POLL_INTERVAL_MS = 10_000;

interface NewOrdersResponse {
  count: number;
  orders: { id: string; orderNumber: number; customerName: string; total: number; createdAt: string }[];
}

/**
 * Polls GET /api/dashboard/new-orders every 10s (only while the tab is
 * visible — Page Visibility API) and surfaces a beep + toast for orders
 * created since the last successful check. No websocket: a business gets at
 * most a handful of orders in flight at once, so a 10s-latency poll is
 * simpler and reliable enough (see CLAUDE.md — no infra we don't need yet).
 *
 * `lastChecked` starts at mount time, not epoch 0, so orders that already
 * existed when the dashboard was opened never notify. On a successful poll
 * with hits, it advances to the newest returned order's createdAt (not
 * client "now") — using the server's own timestamps avoids any client/server
 * clock-skew gap that could silently swallow an order. On a poll with no
 * hits, it deliberately does NOT advance: the `since` bound sent to the API
 * is a lower-exclusive bound, so re-sending the same value next tick is a
 * no-op until a real order shows up — nothing to lose by not moving it.
 */
export function OrderNotificationProvider({ children }: { children: ReactNode }) {
  const lastCheckedRef = useRef<Date | null>(null);
  const inFlightRef = useRef(false);
  const [toasts, setToasts] = useState<OrderToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    lastCheckedRef.current = new Date();
    let cancelled = false;

    async function check() {
      if (inFlightRef.current) return;
      if (document.visibilityState !== "visible") return;
      const since = lastCheckedRef.current;
      if (!since) return;

      inFlightRef.current = true;
      try {
        const res = await fetch(`/api/dashboard/new-orders?since=${encodeURIComponent(since.toISOString())}`, {
          cache: "no-store",
        });
        if (!res.ok || cancelled) return;
        const data: NewOrdersResponse = await res.json();
        if (cancelled || data.count === 0) return;

        const newest = data.orders[data.orders.length - 1];
        lastCheckedRef.current = new Date(newest.createdAt);

        playOrderNotificationSound();
        setToasts((prev) => [...prev, { id: crypto.randomUUID(), count: data.count }]);
      } catch {
        // Network hiccup — since is untouched, so the next tick retries the same window.
      } finally {
        inFlightRef.current = false;
      }
    }

    const interval = setInterval(check, POLL_INTERVAL_MS);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void check();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <>
      {children}
      <OrderToastStack toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
