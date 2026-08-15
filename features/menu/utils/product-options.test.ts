import { describe, expect, it } from "vitest";
import {
  allRequiredGroupsSelected,
  defaultSelection,
  selectionToOptions,
  toggleOptionSelection,
  type ProductOptionGroupValue,
} from "@/features/menu/utils/product-options";

const size: ProductOptionGroupValue = {
  id: "g-size",
  name: "سایز",
  required: true,
  multiSelect: false,
  options: [
    { id: "o-small", name: "کوچک", extraPrice: 0, isDefault: true },
    { id: "o-large", name: "بزرگ", extraPrice: 45000, isDefault: false },
  ],
};

const addons: ProductOptionGroupValue = {
  id: "g-addons",
  name: "افزودنی‌ها",
  required: false,
  multiSelect: true,
  options: [
    { id: "o-rice", name: "برنج اضافه", extraPrice: 65000, isDefault: true },
    { id: "o-doogh", name: "دوغ", extraPrice: 28000, isDefault: false },
  ],
};

describe("defaultSelection", () => {
  it("picks the default option for a single-select group", () => {
    expect(defaultSelection([size])).toEqual({ "g-size": ["o-small"] });
  });

  it("falls back to the first option for a required group with no default", () => {
    const required: ProductOptionGroupValue = { ...size, options: [{ ...size.options[0], isDefault: false }, size.options[1]] };
    expect(defaultSelection([required])).toEqual({ "g-size": ["o-small"] });
  });

  it("collects every default option for a multi-select group", () => {
    expect(defaultSelection([addons])).toEqual({ "g-addons": ["o-rice"] });
  });

  it("skips a group with no options", () => {
    expect(defaultSelection([{ ...size, options: [] }])).toEqual({});
  });
});

describe("toggleOptionSelection", () => {
  it("replaces the pick for a single-select group", () => {
    const selected = { "g-size": ["o-small"] };
    expect(toggleOptionSelection(selected, size, "o-large")).toEqual({ "g-size": ["o-large"] });
  });

  it("adds to the pick for a multi-select group", () => {
    const selected = { "g-addons": ["o-rice"] };
    expect(toggleOptionSelection(selected, addons, "o-doogh")).toEqual({ "g-addons": ["o-rice", "o-doogh"] });
  });

  it("removes an already-selected option from a multi-select group", () => {
    const selected = { "g-addons": ["o-rice", "o-doogh"] };
    expect(toggleOptionSelection(selected, addons, "o-rice")).toEqual({ "g-addons": ["o-doogh"] });
  });
});

describe("selectionToOptions", () => {
  it("resolves selected ids to their group/option data", () => {
    const selected = { "g-size": ["o-large"], "g-addons": ["o-rice", "o-doogh"] };
    expect(selectionToOptions([size, addons], selected)).toEqual([
      { optionId: "o-large", groupName: "سایز", optionName: "بزرگ", extraPrice: 45000 },
      { optionId: "o-rice", groupName: "افزودنی‌ها", optionName: "برنج اضافه", extraPrice: 65000 },
      { optionId: "o-doogh", groupName: "افزودنی‌ها", optionName: "دوغ", extraPrice: 28000 },
    ]);
  });

  it("ignores stale ids that no longer match an option", () => {
    expect(selectionToOptions([size], { "g-size": ["nope"] })).toEqual([]);
  });
});

describe("allRequiredGroupsSelected", () => {
  it("is false when a required group has nothing selected", () => {
    expect(allRequiredGroupsSelected([size], {})).toBe(false);
  });

  it("is true once the required group has a selection", () => {
    expect(allRequiredGroupsSelected([size], { "g-size": ["o-small"] })).toBe(true);
  });

  it("ignores optional groups entirely", () => {
    expect(allRequiredGroupsSelected([addons], {})).toBe(true);
  });
});
