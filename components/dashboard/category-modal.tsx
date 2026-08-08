"use client";

import { useActionState, useEffect, useState } from "react";
import { ModalShell } from "@/components/dashboard/modal-shell";
import { Input } from "@/components/ui/input";
import { FormToggle } from "@/components/dashboard/form-toggle";
import { ImageUploadField } from "@/components/uploads/image-upload-field";
import {
  createCategoryAction,
  updateCategoryAction,
  type ActionState,
} from "@/features/dashboard/routes/actions";
import { cn } from "@/lib/utils";

const ICON_CHOICES = ["کباب", "خورش", "پیش‌غذا", "نوشیدنی", "دسر", "سالاد"];

export interface CategoryFormValue {
  id: string;
  name: string;
  icon: string | null;
  imageUrl: string | null;
  isActive: boolean;
}

const initialState: ActionState = {};

export function CategoryModal({
  category,
  onClose,
}: {
  category: CategoryFormValue | null;
  onClose: () => void;
}) {
  const action = category ? updateCategoryAction.bind(null, category.id) : createCategoryAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [icon, setIcon] = useState(category?.icon ?? ICON_CHOICES[0]);

  useEffect(() => {
    if (state.ok) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <ModalShell
      title={category ? "ویرایش دسته" : "دسته جدید"}
      subtitle={category ? "اطلاعات این دسته‌بندی را ویرایش کنید" : "یک دسته‌بندی تازه برای منو بسازید"}
      onClose={onClose}
      maxWidth={520}
      footer={
        <>
          <button
            type="submit"
            form="category-form"
            disabled={pending}
            className="flex h-[50px] flex-1 items-center justify-center rounded-2xl bg-brand text-base text-white disabled:opacity-60"
          >
            {pending ? "در حال ذخیره…" : "ذخیره دسته"}
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
      <form id="category-form" action={formAction} className="flex flex-col gap-[18px]">
        <input type="hidden" name="icon" value={icon} />
        <ImageUploadField kind="categories" name="imageUrl" defaultUrl={category?.imageUrl} label="تصویر دسته" />
        <Input name="name" label="نام دسته" defaultValue={category?.name} required />
        <div className="flex flex-col gap-2.5">
          <label className="text-right text-[13px] font-light text-text-4">آیکون پیشنهادی</label>
          <div className="flex flex-wrap gap-2">
            {ICON_CHOICES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setIcon(t)}
                className={cn(
                  "flex h-[34px] items-center rounded-[10px] px-4 text-[13px]",
                  icon === t
                    ? "bg-brand text-white"
                    : "border-[0.3px] border-[#CECECE] bg-[#F6F6F6] text-[#555]"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[14px_18px]">
          <div className="text-right">
            <div className="text-sm font-medium">وضعیت نمایش</div>
            <div className="mt-0.5 text-xs font-light text-text-3">دسته در منوی مشتری دیده شود</div>
          </div>
          <FormToggle name="isActive" defaultChecked={category?.isActive ?? true} />
        </div>
        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      </form>
    </ModalShell>
  );
}
