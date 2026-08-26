"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import { Pencil, Search, Trash2 } from "lucide-react";
import { PrimaryButton } from "@/components/dashboard/primary-button";
import { ModalShell } from "@/components/dashboard/modal-shell";
import { Input } from "@/components/ui/input";

export interface TaxonomyItem {
  id: string;
  name: string;
  slug: string;
  count: number;
}

interface ActionState {
  error?: string;
  ok?: boolean;
}

type CreateAction = (prevState: ActionState, formData: FormData) => Promise<ActionState>;
type DeleteAction = (id: string) => Promise<{ ok: boolean; error?: string }>;

const initialState: ActionState = {};

export function BlogTaxonomyView({
  items,
  label,
  createAction,
  updateAction,
  deleteAction,
}: {
  items: TaxonomyItem[];
  label: string;
  createAction: CreateAction;
  updateAction: (id: string, prevState: ActionState, formData: FormData) => Promise<ActionState>;
  deleteAction: DeleteAction;
}) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"closed" | "create" | string>("closed");
  const [isDeleting, startTransition] = useTransition();

  const filtered = useMemo(
    () => items.filter((i) => i.name.toLowerCase().includes(search.trim().toLowerCase())),
    [items, search]
  );
  const editing = modal !== "closed" && modal !== "create" ? (items.find((i) => i.id === modal) ?? null) : null;

  function handleDelete(item: TaxonomyItem) {
    if (!confirm(`${label} «${item.name}» حذف شود؟`)) return;
    startTransition(async () => {
      await deleteAction(item.id);
    });
  }

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          className="flex items-center gap-2.5 rounded-[13px] bg-card px-4"
          style={{ height: 44, width: 300, boxShadow: "0px 4px 12px rgba(0,0,0,0.03)" }}
        >
          <Search size={18} className="text-[#B0B0B0]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`جستجوی ${label}…`}
            className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-[#B0B0B0]"
          />
        </div>
        <PrimaryButton onClick={() => setModal("create")}>{label} جدید</PrimaryButton>
      </div>

      <div className="rounded-[22px] bg-card p-[8px_6px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
        <div className="grid grid-cols-[2fr_1.4fr_0.8fr_1fr] gap-2 p-[12px_18px] text-[13px] font-light text-[#A0A0A0]">
          <span className="text-right">نام</span>
          <span className="text-right">نامک (Slug)</span>
          <span className="text-right">تعداد مقاله</span>
          <span />
        </div>
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-sm text-text-3">موردی یافت نشد.</div>
        ) : (
          filtered.map((item, i) => (
            <div
              key={item.id}
              className="grid grid-cols-[2fr_1.4fr_0.8fr_1fr] items-center gap-2 p-[12px_18px] text-sm"
              style={{ borderTop: i > 0 ? "1px solid #F4F4F4" : "none" }}
            >
              <span className="truncate text-right font-medium">{item.name}</span>
              <span dir="ltr" className="truncate text-right font-mont text-xs text-text-3">
                {item.slug}
              </span>
              <span className="text-right text-xs text-text-3">{item.count.toLocaleString("fa-IR")}</span>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModal(item.id)}
                  aria-label={`ویرایش ${item.name}`}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E4E4E4] text-[#5F5F5F]"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  disabled={isDeleting}
                  aria-label={`حذف ${item.name}`}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#F0DADA] text-[#C15656] disabled:opacity-60"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {modal === "create" && (
        <TaxonomyModal label={label} item={null} action={createAction} onClose={() => setModal("closed")} />
      )}
      {editing && (
        <TaxonomyModal
          label={label}
          item={editing}
          action={updateAction.bind(null, editing.id)}
          onClose={() => setModal("closed")}
        />
      )}
    </div>
  );
}

function TaxonomyModal({
  label,
  item,
  action,
  onClose,
}: {
  label: string;
  item: TaxonomyItem | null;
  action: CreateAction;
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.ok) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <ModalShell
      title={item ? `ویرایش ${label}` : `${label} جدید`}
      onClose={onClose}
      maxWidth={440}
      footer={
        <>
          <button
            type="submit"
            form="taxonomy-form"
            disabled={pending}
            className="flex h-[50px] flex-1 items-center justify-center rounded-2xl bg-brand text-base text-white disabled:opacity-60"
          >
            {pending ? "در حال ذخیره…" : "ذخیره"}
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
      <form id="taxonomy-form" action={formAction} className="flex flex-col gap-[18px]">
        <Input name="name" label={`نام ${label}`} defaultValue={item?.name} required autoFocus />
        {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
      </form>
    </ModalShell>
  );
}
