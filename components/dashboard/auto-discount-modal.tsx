"use client";

import { useActionState, useEffect, useState } from "react";
import { X } from "lucide-react";
import { ModalShell } from "@/components/dashboard/modal-shell";
import { Input } from "@/components/ui/input";
import { JalaliDatePicker } from "@/components/ui/jalali-date-picker";
import { FormToggle } from "@/components/dashboard/form-toggle";
import {
  createAutoDiscountAction,
  updateAutoDiscountAction,
  type ActionState,
} from "@/features/dashboard/routes/actions";
import { cn } from "@/lib/utils";

export interface CategoryOption {
  id: string;
  name: string;
}

export interface ProductOption {
  id: string;
  name: string;
}

type Scope = "ALL_MENU" | "CATEGORY" | "PRODUCT";

export interface AutoDiscountFormValue {
  id: string;
  name: string;
  percent: number;
  scope: Scope;
  categoryIds: string[];
  productId: string | null;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
}

const SCOPE_OPTIONS: { value: Scope; label: string }[] = [
  { value: "ALL_MENU", label: "کل منو" },
  { value: "CATEGORY", label: "دسته‌بندی" },
  { value: "PRODUCT", label: "محصول خاص" },
];

const initialState: ActionState = {};

export function AutoDiscountModal({
  categories,
  products,
  discount,
  onClose,
}: {
  categories: CategoryOption[];
  products: ProductOption[];
  discount: AutoDiscountFormValue | null;
  onClose: () => void;
}) {
  const action = discount ? updateAutoDiscountAction.bind(null, discount.id) : createAutoDiscountAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [scope, setScope] = useState<Scope>(discount?.scope ?? "ALL_MENU");
  const [categoryIds, setCategoryIds] = useState<string[]>(discount?.categoryIds ?? []);

  useEffect(() => {
    if (state.ok) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const availableCategories = categories.filter((c) => !categoryIds.includes(c.id));

  return (
    <ModalShell
      title={discount ? "ویرایش تخفیف خودکار" : "تخفیف خودکار جدید"}
      subtitle={discount ? "ویرایش تخفیف خودکار" : "یک تخفیف خودکار تازه تعریف کنید"}
      onClose={onClose}
      footer={
        <>
          <button
            type="submit"
            form="auto-discount-form"
            disabled={pending}
            className="flex h-[50px] flex-1 items-center justify-center rounded-2xl bg-brand text-base text-white disabled:opacity-60"
          >
            {pending ? "در حال ذخیره…" : "ذخیره تخفیف"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[50px] w-[120px] items-center justify-center rounded-2xl border border-[#DDD] bg-card text-[15px] text-[#777]"
          >
            انصراف
          </button>
        </>
      }
    >
      <form id="auto-discount-form" action={formAction} className="flex flex-col gap-[18px]">
        <input type="hidden" name="scope" value={scope} />

        <div className="flex flex-col gap-4 sm:flex-row">
          <Input name="name" label="نام تخفیف" defaultValue={discount?.name} required className="flex-1" />
          <Input
            name="percent"
            label="درصد تخفیف"
            type="number"
            dir="ltr"
            min={1}
            max={100}
            defaultValue={discount?.percent}
            required
            className="flex-1 text-right"
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-right text-[13px] font-light text-text-4">اعمال بر اساس</label>
          <div className="flex gap-2.5">
            {SCOPE_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setScope(o.value)}
                className={cn(
                  "flex h-11 flex-1 items-center justify-center rounded-xl text-sm",
                  scope === o.value
                    ? "bg-brand font-medium text-white"
                    : "border-[0.3px] border-border-chip bg-chip text-[#666]"
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {scope === "CATEGORY" && (
          <div className="flex flex-col gap-2.5">
            <label className="text-right text-[13px] font-light text-text-4">دسته‌ها</label>
            <div className="flex flex-wrap items-center gap-2">
              {categoryIds.map((id) => {
                const cat = categories.find((c) => c.id === id);
                if (!cat) return null;
                return (
                  <span
                    key={id}
                    className="flex h-[34px] items-center gap-1.5 rounded-chip bg-[#EAF3EB] px-3.5 text-xs text-brand"
                  >
                    <input type="hidden" name="categoryIds" value={id} />
                    {cat.name}
                    <button
                      type="button"
                      onClick={() => setCategoryIds((prev) => prev.filter((x) => x !== id))}
                      aria-label={`حذف ${cat.name}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                );
              })}
              {availableCategories.length > 0 && (
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) setCategoryIds((prev) => [...prev, e.target.value]);
                  }}
                  className="h-[34px] rounded-chip border border-dashed border-border-chip bg-transparent px-3 text-xs text-brand outline-none"
                >
                  <option value="">+ افزودن</option>
                  {availableCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        )}

        {scope === "PRODUCT" && (
          <div className="flex flex-col gap-2">
            <label className="text-right text-[13px] font-light text-text-4">محصول</label>
            <select
              name="productId"
              defaultValue={discount?.productId ?? products[0]?.id}
              required
              className="h-[50px] rounded-input border border-border-input px-[18px] text-right text-sm outline-none focus:border-brand"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-right text-[13px] font-light text-text-4">توضیحات</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={discount?.description ?? ""}
            className="min-h-[76px] rounded-input border border-border-input p-[12px_16px] text-right text-[13px] leading-[1.9] text-[#555] outline-none focus:border-brand"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-right text-[13px] font-light text-text-4">مدت‌زمان</label>
          <div className="flex gap-3.5">
            <JalaliDatePicker name="startDate" placeholder="از تاریخ" defaultValue={discount?.startDate} className="flex-1" />
            <JalaliDatePicker name="endDate" placeholder="تا تاریخ" defaultValue={discount?.endDate} className="flex-1" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[14px_18px]">
          <div className="text-right">
            <div className="text-sm font-medium">وضعیت فعال</div>
            <div className="mt-0.5 text-xs font-light text-text-3">تخفیف خودکار روی سبد مشتری اعمال شود</div>
          </div>
          <FormToggle name="isActive" defaultChecked={discount?.isActive ?? true} />
        </div>

        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      </form>
    </ModalShell>
  );
}
