"use client";

import * as React from "react";
import { Toggle } from "@/components/dashboard/toggle";

export function FormToggle({ name, defaultChecked }: { name: string; defaultChecked: boolean }) {
  const [checked, setChecked] = React.useState(defaultChecked);
  return (
    <>
      <input type="checkbox" name={name} checked={checked} readOnly hidden />
      <Toggle checked={checked} onChange={setChecked} />
    </>
  );
}
