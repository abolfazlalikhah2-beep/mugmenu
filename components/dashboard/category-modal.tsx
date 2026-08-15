"use client";

import { useActionState, useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { ModalShell } from "@/components/dashboard/modal-shell";
import { Input } from "@/components/ui/input";
import { FormToggle } from "@/components/dashboard/form-toggle";
import { Toggle } from "@/components/dashboard/toggle";
import { ImageUploadField } from "@/components/uploads/image-upload-field";
import {
  createCategoryAction,
  updateCategoryAction,
  type ActionState,
} from "@/features/dashboard/routes/actions";
import { cn } from "@/lib/utils";
import { isCategoryVisibleNow, timeToMinutes } from "@/features/menu/utils/category-schedule";

const ICON_CHOICES = ["کباب", "خورش", "پیش‌غذا", "نوشیدنی", "دسر", "سالاد"];

/** [label, JS Date#getDay() value] in Persian week order (starts Saturday). */
const DAY_CHOICES: [string, number][] = [
  ["ش", 6],
  ["ی", 0],
  ["د", 1],
  ["س", 2],
  ["چ", 3],
  ["پ", 4],
  ["ج", 5],
];

export interface CategoryFormValue {
  id: string;
  name: string;
  icon: string | null;
  imageUrl: string | null;
  isActive: boolean;
  scheduleEnabled: boolean;
  scheduleDays: number[];
  scheduleStart: string | null;
  scheduleEnd: string | null;
}

const initialState: ActionState = {};

function ScheduleEditor({
  enabled,
  onEnabledChange,
  days,
  onDaysChange,
  start,
  onStartChange,
  end,
  onEndChange,
}: {
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
  days: number[];
  onDaysChange: (v: number[]) => void;
  start: string;
  onStartChange: (v: string) => void;
  end: string;
  onEndChange: (v: string) => void;
}) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const startMin = timeToMinutes(start || "00:00");
  const endMin = timeToMinutes(end || "00:00");
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const widthPercent = start && end ? ((endMin - startMin + 1440) % 1440 || 1440) / 1440 * 100 : 100;
  const visibleNow = isCategoryVisibleNow(
    { scheduleEnabled: enabled, scheduleDays: days, scheduleStart: start || null, scheduleEnd: end || null },
    now
  );

  function toggleDay(d: number) {
    onDaysChange(days.includes(d) ? days.filter((x) => x !== d) : [...days, d]);
  }

  return (
    <div className="flex flex-col gap-3.5 rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[14px_16px]">
      <div className="flex items-center justify-between gap-3">
        <div className="text-right">
          <div className="text-[14.5px] font-medium">زمان‌بندی نمایش (اختیاری)</div>
          <div className="mt-0.5 text-xs font-light leading-[1.7] text-text-3">
            دسته فقط در بازه‌ی تعیین‌شده در منوی عمومی دیده می‌شود
          </div>
        </div>
        <Toggle checked={enabled} onChange={onEnabledChange} />
      </div>

      {enabled && (
        <>
          <div className="flex flex-wrap items-end gap-3">
            <Input
              name="scheduleStart"
              label="از ساعت"
              dir="ltr"
              className="flex-1 text-right"
              placeholder="07:00"
              value={start}
              onChange={(e) => onStartChange(e.target.value)}
            />
            <span className="flex h-[50px] items-center text-[13px] text-text-3">تا</span>
            <Input
              name="scheduleEnd"
              label="تا ساعت"
              dir="ltr"
              className="flex-1 text-right"
              placeholder="11:00"
              value={end}
              onChange={(e) => onEndChange(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-right text-[13px] font-light text-text-4">روزهای فعال</label>
            <div className="flex flex-wrap gap-1.5">
              {DAY_CHOICES.map(([label, value]) => {
                const on = days.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleDay(value)}
                    className={cn(
                      "flex h-[38px] w-[38px] items-center justify-center rounded-xl text-[13.5px]",
                      on ? "bg-brand text-white" : "border-[0.3px] border-[#CECECE] bg-[#F6F6F6] text-text-3"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-[#EFEFEF]" />

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#EAEAEA] bg-card p-[13px_14px]">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[11px] bg-[#F1F1F1]">
                <Clock size={18} className="text-[#8A8A8A]" />
              </div>
              <div className="text-right">
                <div className="text-[13.5px] font-medium">
                  الان ساعت {now.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })} است
                </div>
                <div className="mt-0.5 text-[11.5px] font-light text-text-3">
                  {visibleNow ? "این دسته الان در منو نمایش داده می‌شود" : "این دسته الان در منو نمایش داده نمی‌شود"}
                </div>
              </div>
            </div>
            <span
              className="shrink-0 rounded-[9px] px-3 py-[5px] text-xs font-medium"
              style={visibleNow ? { color: "#328C3D", background: "#E5F0E6" } : { color: "#B03B3F", background: "#FDECEC" }}
            >
              {visibleNow ? "در بازه" : "خارج از بازه"}
            </span>
          </div>

          {start && end && (
            <div className="flex flex-col gap-2">
              <div className="relative h-2.5 overflow-hidden rounded-md bg-[#F0F0F0]">
                <div
                  className="absolute top-0 bottom-0 rounded-md bg-brand"
                  style={{ right: `${(startMin / 1440) * 100}%`, width: `${widthPercent}%` }}
                />
                <div className="absolute -top-[3px] -bottom-[3px] w-0.5 bg-[#E5484D]" style={{ right: `${(nowMin / 1440) * 100}%` }} />
              </div>
              <div className="flex items-center gap-3.5 text-[11px] text-text-3">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-3 rounded-sm bg-brand" />
                  بازه نمایش {start} تا {end}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-0.5 bg-[#E5484D]" />
                  زمان فعلی
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

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
  const [scheduleEnabled, setScheduleEnabled] = useState(category?.scheduleEnabled ?? false);
  const [scheduleDays, setScheduleDays] = useState<number[]>(category?.scheduleDays ?? []);
  const [scheduleStart, setScheduleStart] = useState(category?.scheduleStart ?? "");
  const [scheduleEnd, setScheduleEnd] = useState(category?.scheduleEnd ?? "");

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
        <input type="hidden" name="scheduleEnabled" value={scheduleEnabled ? "true" : "false"} />
        {scheduleDays.map((d) => (
          <input key={d} type="hidden" name="scheduleDays" value={d} />
        ))}
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
        <ScheduleEditor
          enabled={scheduleEnabled}
          onEnabledChange={setScheduleEnabled}
          days={scheduleDays}
          onDaysChange={setScheduleDays}
          start={scheduleStart}
          onStartChange={setScheduleStart}
          end={scheduleEnd}
          onEndChange={setScheduleEnd}
        />
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
