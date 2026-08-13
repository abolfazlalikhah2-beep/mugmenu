/**
 * Pure helpers for a product's option groups (size/bread type/etc.) —
 * shared between the item-detail "add to cart" flow and the cart's
 * "edit options" flow, both of which need the same selection/pricing
 * logic (components/menu/product-options-form.tsx renders it).
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
  options: ProductOptionValue[];
}

export interface SelectedCartOption {
  optionId: string;
  groupName: string;
  optionName: string;
  extraPrice: number;
}

/** Seeds each group's default pick: its isDefault option, or (for required groups with none marked default) the first option. */
export function defaultSelection(groups: ProductOptionGroupValue[]): Record<string, string> {
  const entries: [string, string][] = [];
  for (const g of groups) {
    if (g.options.length === 0) continue;
    const def = g.options.find((o) => o.isDefault) ?? (g.required ? g.options[0] : undefined);
    if (def) entries.push([g.id, def.id]);
  }
  return Object.fromEntries(entries);
}

export function selectionToOptions(
  groups: ProductOptionGroupValue[],
  selected: Record<string, string>
): SelectedCartOption[] {
  return groups
    .map((g) => {
      const option = g.options.find((o) => o.id === selected[g.id]);
      return option
        ? { optionId: option.id, groupName: g.name, optionName: option.name, extraPrice: option.extraPrice }
        : null;
    })
    .filter((o): o is SelectedCartOption => o !== null);
}

export function allRequiredGroupsSelected(
  groups: ProductOptionGroupValue[],
  selected: Record<string, string>
): boolean {
  return groups.every((g) => !g.required || !!selected[g.id]);
}
