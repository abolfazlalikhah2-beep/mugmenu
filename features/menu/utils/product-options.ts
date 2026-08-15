/**
 * Pure helpers for a product's option groups (size/bread type/etc., plus
 * multi-select groups like افزودنی‌ها) — shared between the item-detail
 * "add to cart" flow and the cart's "edit options" flow, both of which need
 * the same selection/pricing logic (components/menu/product-options-form.tsx
 * renders it).
 */

export interface ProductOptionValue {
  id: string;
  name: string;
  extraPrice: number;
  isDefault: boolean;
}

export interface ProductOptionGroupValue {
  id: string;
  name: string;
  required: boolean;
  /** Single-select (radio chips) when false; multi-select (checkbox chips, e.g. افزودنی‌ها) when true. */
  multiSelect: boolean;
  options: ProductOptionValue[];
}

export interface SelectedCartOption {
  optionId: string;
  groupName: string;
  optionName: string;
  extraPrice: number;
}

/** groupId -> selected option ids. Single-select groups hold at most one id. */
export type OptionSelection = Record<string, string[]>;

/** Seeds each group's default pick(s): its isDefault option(s), or (for required single-select groups with none marked default) the first option. */
export function defaultSelection(groups: ProductOptionGroupValue[]): OptionSelection {
  const entries: [string, string[]][] = [];
  for (const g of groups) {
    if (g.options.length === 0) continue;
    if (g.multiSelect) {
      const defaults = g.options.filter((o) => o.isDefault).map((o) => o.id);
      if (defaults.length > 0) entries.push([g.id, defaults]);
    } else {
      const def = g.options.find((o) => o.isDefault) ?? (g.required ? g.options[0] : undefined);
      if (def) entries.push([g.id, [def.id]]);
    }
  }
  return Object.fromEntries(entries);
}

/** Applies a chip click: replaces the pick for single-select groups, toggles membership for multi-select groups. */
export function toggleOptionSelection(
  selected: OptionSelection,
  group: ProductOptionGroupValue,
  optionId: string
): OptionSelection {
  const current = selected[group.id] ?? [];
  if (group.multiSelect) {
    const next = current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId];
    return { ...selected, [group.id]: next };
  }
  return { ...selected, [group.id]: [optionId] };
}

export function selectionToOptions(
  groups: ProductOptionGroupValue[],
  selected: OptionSelection
): SelectedCartOption[] {
  return groups.flatMap((g) => {
    const ids = selected[g.id] ?? [];
    return ids
      .map((id) => g.options.find((o) => o.id === id))
      .filter((o): o is ProductOptionValue => !!o)
      .map((o) => ({ optionId: o.id, groupName: g.name, optionName: o.name, extraPrice: o.extraPrice }));
  });
}

export function allRequiredGroupsSelected(groups: ProductOptionGroupValue[], selected: OptionSelection): boolean {
  return groups.every((g) => !g.required || (selected[g.id]?.length ?? 0) > 0);
}
