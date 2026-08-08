"use client";

import { useActionState, useEffect } from "react";
import { ModalShell } from "@/components/dashboard/modal-shell";
import { Input } from "@/components/ui/input";
import { FormToggle } from "@/components/dashboard/form-toggle";
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

export interface ProductFormValue {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discountPercent: number | null;
  categoryId: string;
  isActive: boolean;
  imageUrl: string | null;
}

const initialState: ActionState = {};

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
