"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/dashboard/toggle";
import { FormToggle } from "@/components/dashboard/form-toggle";
import { createPostAction, updatePostAction, type ActionState } from "@/features/blog/routes/actions";

export interface BlogPostFormValue {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: string | null; // "YYYY-MM-DD" or null
  seoTitle: string | null;
  seoDescription: string | null;
  seoNoIndex: boolean;
  canonicalUrl: string | null;
  categoryIds: string[];
  tagIds: string[];
}

const initialState: ActionState = {};
const SITE_HOST = "mugmenu.ir";

function slugifyClientSide(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/‌/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function BlogPostForm({
  post,
  categories,
  tags,
}: {
  post: BlogPostFormValue | null;
  categories: { id: string; name: string }[];
  tags: { id: string; name: string }[];
}) {
  const action = post ? updatePostAction.bind(null, post.id) : createPostAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [published, setPublished] = useState(post?.status === "PUBLISHED");
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription ?? "");

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugifyClientSide(value));
  }

  const previewTitle = (seoTitle || title || "عنوان مقاله") + " — بلاگ ماگ‌منو";
  const previewUrl = `${SITE_HOST} › blog › ${slug || "..."}`;
  const previewDescription = seoDescription || excerpt || "توضیحات این مقاله اینجا نمایش داده می‌شود.";

  return (
    <form action={formAction} className="grid gap-5.5 lg:grid-cols-[1fr_360px]">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="status" value={published ? "PUBLISHED" : "DRAFT"} />

      <div className="flex flex-col gap-5.5">
        <div className="flex flex-col gap-[18px] rounded-[22px] bg-card p-[24px_26px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
          <Input
            name="title"
            label="عنوان مقاله"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />
          <div className="flex flex-col gap-2">
            <label htmlFor="blog-slug" className="text-right text-[13px] font-light text-text-4">
              نامک (Slug)
            </label>
            <div className="flex h-[50px] items-center gap-2 rounded-input border border-border-input px-[18px] focus-within:border-brand">
              <span dir="ltr" className="font-mont text-xs text-text-3">
                /blog/
              </span>
              <input
                id="blog-slug"
                dir="ltr"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugifyClientSide(e.target.value));
                }}
                className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="blog-excerpt" className="text-right text-[13px] font-light text-text-4">
              خلاصه مقاله
            </label>
            <textarea
              id="blog-excerpt"
              name="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              maxLength={500}
              rows={3}
              required
              className="resize-none rounded-input border border-border-input px-[18px] py-3.5 text-sm text-ink outline-none focus:border-brand"
            />
            <span className="text-left text-[11px] font-light text-text-4">{excerpt.length.toLocaleString("fa-IR")}/۵۰۰</span>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="blog-content" className="text-right text-[13px] font-light text-text-4">
              متن مقاله
            </label>
            <textarea
              id="blog-content"
              name="content"
              defaultValue={post?.content ?? ""}
              rows={18}
              required
              className="resize-y rounded-input border border-border-input px-[18px] py-3.5 text-sm leading-[1.9] text-ink outline-none focus:border-brand"
            />
          </div>
        </div>

        <details className="group rounded-[22px] bg-card shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3.5 p-[20px_26px] text-base font-semibold [&::-webkit-details-marker]:hidden">
            <span>تنظیمات سئو (SEO)</span>
            <span className="text-xs font-light text-text-3 group-open:hidden">برای باز کردن کلیک کنید</span>
          </summary>
          <div className="flex flex-col gap-[18px] p-[0_26px_26px]">
            <Input
              name="seoTitle"
              label="عنوان سئو (جایگزین عنوان مقاله در تگ title)"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              maxLength={70}
              placeholder={title}
            />
            <div className="flex flex-col gap-2">
              <label htmlFor="blog-seo-description" className="text-right text-[13px] font-light text-text-4">
                توضیحات متا (Meta Description)
              </label>
              <textarea
                id="blog-seo-description"
                name="seoDescription"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                maxLength={160}
                rows={2}
                placeholder={excerpt}
                className="resize-none rounded-input border border-border-input px-[18px] py-3.5 text-sm text-ink outline-none focus:border-brand"
              />
            </div>
            <Input name="canonicalUrl" label="آدرس Canonical (اختیاری)" dir="ltr" defaultValue={post?.canonicalUrl ?? ""} />
            <div className="flex items-center justify-between rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[14px_18px]">
              <div className="text-right">
                <div className="text-sm font-medium">No-index</div>
                <div className="mt-0.5 text-xs font-light text-text-3">این مقاله از نتایج جستجو مخفی بماند</div>
              </div>
              <FormToggle name="seoNoIndex" defaultChecked={post?.seoNoIndex ?? false} />
            </div>

            <div className="flex flex-col gap-1.5 rounded-2xl border border-[#E5E5E5] bg-white p-[16px_18px]">
              <span className="text-[11px] font-light text-text-3">پیش‌نمایش در نتایج گوگل</span>
              <span dir="ltr" className="truncate text-left text-sm text-[#1a0dab]">
                {previewTitle}
              </span>
              <span dir="ltr" className="truncate text-left text-xs text-[#006621]">
                {previewUrl}
              </span>
              <span className="line-clamp-2 text-[13px] leading-[1.6] text-[#545454]">{previewDescription}</span>
            </div>
          </div>
        </details>
      </div>

      <div className="flex flex-col gap-5.5">
        <div className="flex flex-col gap-[18px] rounded-[22px] bg-card p-[24px_26px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between rounded-2xl border border-[#F0F0F0] bg-[#FAFBFA] p-[14px_18px]">
            <div className="text-right">
              <div className="text-sm font-medium">وضعیت انتشار</div>
              <div className="mt-0.5 text-xs font-light text-text-3">{published ? "منتشرشده" : "پیش‌نویس"}</div>
            </div>
            <Toggle checked={published} onChange={setPublished} />
          </div>
          <Input
            name="publishedAt"
            type="date"
            label="تاریخ انتشار"
            dir="ltr"
            className="text-right"
            defaultValue={post?.publishedAt ?? ""}
          />
          <Input
            name="coverImage"
            label="آدرس تصویر کاور (URL)"
            dir="ltr"
            className="text-right"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />
          {coverImage && (
            // Admin-typed arbitrary URL — not restricted to the S3 remotePattern next/image requires.
            <img src={coverImage} alt="" className="h-32 w-full rounded-2xl object-cover" />
          )}
        </div>

        <div className="flex flex-col gap-3.5 rounded-[22px] bg-card p-[24px_26px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
          <div className="text-sm font-medium">دسته‌بندی‌ها</div>
          {categories.length === 0 ? (
            <p className="text-xs font-light text-text-3">هنوز دسته‌بندی‌ای ثبت نشده — از صفحه‌ی دسته‌بندی‌ها اضافه کنید.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {categories.map((c) => (
                <label key={c.id} className="flex items-center gap-2.5 text-sm">
                  <input
                    type="checkbox"
                    name="categoryIds"
                    value={c.id}
                    defaultChecked={post?.categoryIds.includes(c.id) ?? false}
                    className="h-4 w-4 accent-brand"
                  />
                  {c.name}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3.5 rounded-[22px] bg-card p-[24px_26px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
          <div className="text-sm font-medium">برچسب‌ها</div>
          {tags.length === 0 ? (
            <p className="text-xs font-light text-text-3">هنوز برچسبی ثبت نشده — از صفحه‌ی برچسب‌ها اضافه کنید.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <label
                  key={t.id}
                  className="flex cursor-pointer items-center gap-1.5 rounded-pill border border-[#E4E4E4] px-3 py-1.5 text-xs has-[:checked]:border-brand has-[:checked]:bg-brand/8 has-[:checked]:text-brand"
                >
                  <input
                    type="checkbox"
                    name="tagIds"
                    value={t.id}
                    defaultChecked={post?.tagIds.includes(t.id) ?? false}
                    className="hidden"
                  />
                  {t.name}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            type="submit"
            disabled={pending}
            className="flex h-[52px] items-center justify-center rounded-2xl bg-brand text-base font-medium text-white disabled:opacity-60"
          >
            {pending ? "در حال ذخیره…" : "ذخیره مقاله"}
          </button>
          {state.error && <p className="text-right text-xs text-red-500">{state.error}</p>}
          {state.ok && <p className="text-right text-xs text-success">ذخیره شد.</p>}
        </div>
      </div>
    </form>
  );
}
