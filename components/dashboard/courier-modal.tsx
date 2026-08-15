"use client";

import { useActionState, useEffect, useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { ModalShell } from "@/components/dashboard/modal-shell";
import { Input } from "@/components/ui/input";
import { FormToggle } from "@/components/dashboard/form-toggle";
import {
  createCourierAction,
  updateCourierAction,
  type ActionState,
} from "@/features/dashboard/routes/actions";

export interface CourierFormValue {
  id: string;
  name: string;
  phone: string;
  vehicleType: "MOTORCYCLE" | "CAR";
  nationalCode: string | null;
  coverageZones: string[];
  isActive: boolean;
}

const initialState: ActionState = {};

function ZonesEditor({ zones, onChange }: { zones: string[]; onChange: (zones: string[]) => void }) {
  const [draft, setDraft] = useState("");

  function addZone() {
    const value = draft.trim();
    if (!value || zones.includes(value)) {
      setDraft("");
      return;
    }
    onChange([...zones, value]);
    setDraft("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addZone();
    }
  }

  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-right text-[13px] font-light text-text-4">مناطق تحت پوشش</label>
      <div className="flex flex-wrap gap-2">
        {zones.map((z) => (
          <span
            key={z}
            className="flex h-[34px] items-center gap-1.5 rounded-[10px] border border-brand/25 bg-brand/[0.07] px-3.5 text-[12.5px] text-brand"
          >
            {z}
            <button type="button" onClick={() => onChange(zones.filter((x) => x !== z))} aria-label={`حذف ${z}`}>
              <X size={13} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="نام منطقه را وارد و اینتر بزنید"
          className="h-[42px] min-w-0 flex-1 rounded-input border border-border-input px-3.5 text-right text-sm outline-none focus:border-brand"
        />
        <button
          type="button"
          onClick={addZone}
          className="h-[42px] shrink-0 rounded-xl border border-dashed border-brand px-4 text-[13px] font-medium text-brand"
        >
          افزودن
        </button>
      </div>
    </div>
  );
}

export function CourierModal({
  courier,
  onClose,
}: {
  courier: CourierFormValue | null;
  onClose: () => void;
}) {
  const action = courier ? updateCourierAction.bind(null, courier.id) : createCourierAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [zones, setZones] = useState<string[]>(courier?.coverageZones ?? []);

  useEffect(() => {
    if (state.ok) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <ModalShell
      title={courier ? "ویرایش پیک" : "پیک جدید"}
      subtitle={courier ? "اطلاعات این پیک را ویرایش کنید" : "اطلاعات پیک داخلی را وارد کنید"}
      onClose={onClose}
      maxWidth={540}
      footer={
        <>
          <button
            type="submit"
            form="courier-form"
            disabled={pending}
            className="flex h-[50px] flex-1 items-center justify-center rounded-2xl bg-brand text-base font-medium text-white disabled:opacity-60"
          >
            {pending ? "در حال ذخیره…" : "ذخیره پیک"}
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
      <form id="courier-form" action={formAction} className="flex flex-col gap-[18px]">
        {zones.map((z) => (
          <input key={z} type="hidden" name="coverageZones" value={z} />
        ))}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Input name="name" label="نام و نام خانوادگی" defaultValue={courier?.name} required className="flex-1" />
          <Input
            name="phone"
            label="شماره تماس"
            dir="ltr"
            className="flex-1 text-right"
            defaultValue={courier?.phone}
            placeholder="۰۹۱۲۰۰۰۰۰۰۰"
            required
          />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-right text-[13px] font-light text-text-4">وسیله نقلیه</label>
            <select
              name="vehicleType"
              defaultValue={courier?.vehicleType ?? "MOTORCYCLE"}
              className="h-[50px] rounded-input border border-border-input px-[18px] text-right text-sm outline-none focus:border-brand"
            >
              <option value="MOTORCYCLE">موتور</option>
              <option value="CAR">خودرو</option>
            </select>
          </div>
          <Input
            name="nationalCode"
            label="کد ملی (اختیاری)"
            dir="ltr"
            className="flex-1 text-right"
            defaultValue={courier?.nationalCode ?? ""}
          />
        </div>
        <ZonesEditor zones={zones} onChange={setZones} />
        <div className="flex items-center justify-between rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[14px_18px]">
          <div className="text-right">
            <div className="text-sm font-medium">وضعیت فعال</div>
            <div className="mt-0.5 text-xs font-light text-text-3">
              پیک غیرفعال در لیست تخصیص سفارش نمایش داده نمی‌شود
            </div>
          </div>
          <FormToggle name="isActive" defaultChecked={courier?.isActive ?? true} />
        </div>
        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      </form>
    </ModalShell>
  );
}
