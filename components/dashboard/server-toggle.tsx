"use client";

import * as React from "react";
import { Toggle } from "@/components/dashboard/toggle";

export function ServerToggle({
  initial,
  action,
}: {
  initial: boolean;
  action: (next: boolean) => Promise<{ ok: boolean; error?: string } | undefined>;
}) {
  const [checked, setChecked] = React.useState(initial);
  const [pending, startTransition] = React.useTransition();

  return (
    <Toggle
      checked={checked}
      disabled={pending}
      onChange={(next) => {
        setChecked(next);
        startTransition(async () => {
          const result = await action(next);
          if (result && !result.ok) setChecked(!next);
        });
      }}
    />
  );
}
