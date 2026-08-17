"use client";

import { createContext, useContext, useState, useTransition, type ReactNode } from "react";
import { toggleAcceptingOrdersAction } from "@/features/dashboard/routes/actions";

interface AcceptingOrdersContextValue {
  isAcceptingOrders: boolean;
  pending: boolean;
  toggle: (next: boolean) => void;
}

const AcceptingOrdersContext = createContext<AcceptingOrdersContextValue | null>(null);

/**
 * Single source of truth for the "accepting orders" flag, shared by the two
 * toggle buttons that show it (Topbar header + dashboard overview's
 * ProfileCard) — each used to hold its own useState, so flipping one left
 * the other stale until a full page reload. Lives at the dashboard layout
 * level so it also survives client-side navigation between dashboard pages.
 */
export function AcceptingOrdersProvider({
  initial,
  children,
}: {
  initial: boolean;
  children: ReactNode;
}) {
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(initial);
  const [pending, startTransition] = useTransition();

  const toggle = (next: boolean) => {
    setIsAcceptingOrders(next);
    startTransition(async () => {
      const result = await toggleAcceptingOrdersAction(next);
      if (result && !result.ok) setIsAcceptingOrders(!next);
    });
  };

  return (
    <AcceptingOrdersContext.Provider value={{ isAcceptingOrders, pending, toggle }}>
      {children}
    </AcceptingOrdersContext.Provider>
  );
}

export function useAcceptingOrders(): AcceptingOrdersContextValue {
  const ctx = useContext(AcceptingOrdersContext);
  if (!ctx) throw new Error("useAcceptingOrders must be used within AcceptingOrdersProvider");
  return ctx;
}
