"use client";

import { useActionState, useEffect, useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { ModalShell } from "@/components/dashboard/modal-shell";
import { Input } from "@/components/ui/input";
import { FormToggle } from "@/components/dashboard/form-toggle";
import { Toggle } from "@/components/dashboard/toggle";
import { ImageUploadField } from "@/components/uploads/image-upload-field";
import {
  createProductAction,
  updateProductAction,
  type ActionState,
} from "@/features/dashboard/routes/actions";

export interface CategoryOption {
  id: string;
  name: string;
}

export interface ProductOptionValue {
  name: string;
  extraPrice: number;
  isDefault: boolean;
}

export interface ProductOptionGroupValue {
  name: string;
  required: boolean;
  options: ProductOptionValue[];
}

export interface ProductFormValue {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discountPercent: number | null;
  categoryId: string;
  isActive: boolean;
  imageUrl: string | null;
  optionGroups?: ProductOptionGroupValue[];
}

const initialState: ActionState = {};

function emptyOption(): ProductOptionValue {
  return { name: "", extraPrice: 0, isDefault: false };
}

function emptyGroup(): ProductOptionGroupValue {
  return { name: "", required: false, options: [emptyOption()] };
}

function OptionGroupsEditor({
  groups,
  onChange,
}: {
  groups: ProductOptionGroupValue[];
  onChange: (groups: ProductOptionGroupValue[]) => void;
}) {
  function updateGroup(gi: number, patch: Partial<ProductOptionGroupValue>) {
    onChange(groups.map((g, i) => (i === gi ? { ...g, ...patch } : g)));
  }
  function removeGroup(gi: number) {
    onChange(groups.filter((_, i) => i !== gi));
  }
  function updateOption(gi: number, oi: number, patch: Partial<ProductOptionValue>) {
    onChange(
      groups.map((g, i) =>
        i === gi ? { ...g, options: g.options.map((o, j) => (j === oi ? { ...o, ...patch } : o)) } : g
      )
    );
  }
  function removeOption(gi: number, oi: number) {
    onChange(
      groups.map((g, i) => (i === gi ? { ...g, options: g.options.filter((_, j) => j !== oi) } : g))
    );
  }
  function addOption(gi: number) {
    onChange(groups.map((g, i) => (i === gi ? { ...g, options: [...g.options, emptyOption()] } : g)));
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[14px_16px]">
      <div className="text-right">
        <div className="text-[14.5px] font-medium">گزینه‌های محصول (اختیاری)</div>
        <div className="mt-0.5 text-xs font-light text-text-3">
          ویژگی‌هایی مثل سایز یا نوع نان، هرکدام با قیمت اضافه‌ی جداگانه
        </div>
      </div>

      {groups.map((g, gi) => (
        <div key={gi} className="flex flex-col gap-3 rounded-2xl border border-border-line bg-card p-3">
          <div className="flex flex-wrap items-center gap-2">
            <GripVertical size={16} className="shrink-0 text-[#CFCFCF]" />
            <input
              value={g.name}
              onChange={(e) => updateGroup(gi, { name: e.target.value })}
              placeholder="نام ویژگی (مثل سایز)"
              className="h-[42px] min-w-0 flex-1 rounded-input border border-border-input px-3 text-right text-sm outline-none focus:border-brand"
            />
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="text-xs text-[#7A7A7A]">الزامی</span>
              <Toggle checked={g.required} onChange={(v) => updateGroup(gi, { required: v })} />
            </div>
            <button
              type="button"
              onClick={() => removeGroup(gi)}
              aria-label="حذف ویژگی"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#FBECEC]"
            >
              <Trash2 size={16} className="text-[#D06666]" />
            </button>
          </div>

          <div className="flex flex-col gap-2 border-t border-[#F4F4F4] pt-3">
            {g.options.map((o, oi) => (
              <div key={oi} className="flex items-center gap-2">
                <input
                  value={o.name}
                  onChange={(e) => updateOption(gi, oi, { name: e.target.value })}
                  placeholder="نام گزینه"
                  className="h-[42px] min-w-0 flex-1 rounded-input border border-border-input px-3 text-right text-sm outline-none focus:border-brand"
                />
                <input
                  type="number"
                  dir="ltr"
                  min={0}
                  value={o.extraPrice || ""}
                  onChange={(e) => updateOption(gi, oi, { extraPrice: Number(e.target.value) || 0 })}
                  placeholder="۰"
                  className="h-[42px] w-[100px] shrink-0 rounded-input border border-border-input px-3 text-right text-sm outline-none focus:border-brand"
                />
                <span className="w-9 shrink-0 text-[11.5px] text-text-3">تومان</span>
                <button
                  type="button"
                  onClick={() => updateOption(gi, oi, { isDefault: !o.isDefault })}
                  className={
                    "h-9 shrink-0 rounded-[11px] border px-2.5 text-[11px] whitespace-nowrap " +
                    (o.isDefault ? "border-brand bg-[#E5F0E6] text-brand" : "border-border-input text-text-3")
                  }
                >
                  پیش‌فرض
                </button>
                <button
                  type="button"
                  onClick={() => removeOption(gi, oi)}
                  disabled={g.options.length <= 1}
                  aria-label="حذف گزینه"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#FBECEC] disabled:opacity-40"
                >
                  <Trash2 size={14} className="text-[#D06666]" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addOption(gi)}
              className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#CFCFCF] text-[12.5px] text-brand"
            >
              <Plus size={15} />
              افزودن گزینه
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...groups, emptyGroup()])}
        className="flex h-11 items-center justify-center gap-1.5 rounded-btn border border-dashed border-brand bg-brand/[0.05] text-[13.5px] font-medium text-brand"
      >
        <Plus size={17} />
        افزودن ویژگی جدید
      </button>
    </div>
  );
}

export function ProductModal({
  categories,
  product,
  onClose,
}: {
  categories: CategoryOption[];
  product: ProductFormValue | null;
  onClose: () => void;
}) {
  const action = product ? updateProductAction.bind(null, product.id) : createProductAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [optionGroups, setOptionGroups] = useState<ProductOptionGroupValue[]>(product?.optionGroups ?? []);

  useEffect(() => {
    if (state.ok) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <ModalShell
      title={product ? "ویرایش محصول" : "محصول جدید"}
      subtitle={product ? "اطلاعات آیتم منو را ویرایش کنید" : "یک آیتم تازه به منو اضافه کنید"}
      onClose={onClose}
      footer={
        <>
          <button
            type="submit"
            form="product-form"
            disabled={pending}
            className="flex h-[50px] flex-1 items-center justify-center rounded-2xl bg-brand text-base text-white disabled:opacity-60"
          >
            {pending ? "در حال ذخیره…" : "ذخیره تغییرات"}
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
      <form id="product-form" action={formAction} className="flex flex-col gap-[18px]">
        <input type="hidden" name="optionGroups" value={JSON.stringify(optionGroups)} />
        <ImageUploadField kind="products" name="imageUrl" defaultUrl={product?.imageUrl} label="تصویر محصول" />
        <div className="flex flex-col gap-4 sm:flex-row">
          <Input name="name" label="نام محصول" defaultValue={product?.name} required className="flex-1" />
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-right text-[13px] font-light text-text-4">دسته‌بندی</label>
            <select
              name="categoryId"
              defaultValue={product?.categoryId ?? categories[0]?.id}
              required
              className="h-[50px] rounded-input border border-border-input px-[18px] text-right text-sm outline-none focus:border-brand"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Input
            name="price"
            label="قیمت (تومان)"
            type="number"
            dir="ltr"
            className="flex-1 text-right"
            defaultValue={product?.price}
            required
          />
          <Input
            name="discountPercent"
            label="تخفیف (٪)"
            type="number"
            dir="ltr"
            className="flex-1 text-right"
            defaultValue={product?.discountPercent ?? 0}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-right text-[13px] font-light text-text-4">توضیحات</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={product?.description ?? ""}
            className="min-h-[76px] rounded-input border border-border-input p-[12px_16px] text-right text-[13px] leading-[1.9] text-[#555] outline-none focus:border-brand"
          />
        </div>
        <OptionGroupsEditor groups={optionGroups} onChange={setOptionGroups} />
        <div className="flex items-center justify-between rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[14px_18px]">
          <div className="text-right">
            <div className="text-sm font-medium">وضعیت نمایش</div>
            <div className="mt-0.5 text-xs font-light text-text-3">محصول در منو برای مشتری نمایش داده شود</div>
          </div>
          <FormToggle name="isActive" defaultChecked={product?.isActive ?? true} />
        </div>
        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      </form>
    </ModalShell>
  );
}
