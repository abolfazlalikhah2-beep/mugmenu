"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/features/auth/services/authorize";
import * as blogService from "@/features/blog/services/blog-service";

export interface ActionState {
  error?: string;
  ok?: boolean;
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function postInputFromForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content") ?? ""),
    coverImage: String(formData.get("coverImage") ?? ""),
    status: String(formData.get("status") ?? "DRAFT"),
    publishedAt: String(formData.get("publishedAt") ?? ""),
    categoryIds: formData.getAll("categoryIds").map(String),
    tagIds: formData.getAll("tagIds").map(String),
    seoTitle: String(formData.get("seoTitle") ?? ""),
    seoDescription: String(formData.get("seoDescription") ?? ""),
    seoNoIndex: bool(formData, "seoNoIndex"),
    canonicalUrl: String(formData.get("canonicalUrl") ?? ""),
  };
}

export async function createPostAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireSuperAdmin();
  const result = await blogService.createPost(postInputFromForm(formData));
  if (!result.ok) return { error: result.error };
  revalidatePath("/superadmin/blog");
  revalidatePath("/blog");
  redirect(`/superadmin/blog/${result.id}`);
}

export async function updatePostAction(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireSuperAdmin();
  const result = await blogService.updatePost(id, postInputFromForm(formData));
  if (!result.ok) return { error: result.error };
  revalidatePath("/superadmin/blog");
  revalidatePath(`/superadmin/blog/${id}`);
  revalidatePath("/blog");
  return { ok: true };
}

export async function deletePostAction(id: string) {
  await requireSuperAdmin();
  const result = await blogService.deletePost(id);
  revalidatePath("/superadmin/blog");
  revalidatePath("/blog");
  return result;
}

export async function createCategoryAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireSuperAdmin();
  const result = await blogService.createCategory({ name: String(formData.get("name") ?? "") });
  if (!result.ok) return { error: result.error };
  revalidatePath("/superadmin/blog/categories");
  return { ok: true };
}

export async function updateCategoryAction(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireSuperAdmin();
  const result = await blogService.updateCategory(id, { name: String(formData.get("name") ?? "") });
  if (!result.ok) return { error: result.error };
  revalidatePath("/superadmin/blog/categories");
  return { ok: true };
}

export async function deleteCategoryAction(id: string) {
  await requireSuperAdmin();
  const result = await blogService.deleteCategory(id);
  revalidatePath("/superadmin/blog/categories");
  return result;
}

export async function createTagAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireSuperAdmin();
  const result = await blogService.createTag({ name: String(formData.get("name") ?? "") });
  if (!result.ok) return { error: result.error };
  revalidatePath("/superadmin/blog/tags");
  return { ok: true };
}

export async function updateTagAction(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireSuperAdmin();
  const result = await blogService.updateTag(id, { name: String(formData.get("name") ?? "") });
  if (!result.ok) return { error: result.error };
  revalidatePath("/superadmin/blog/tags");
  return { ok: true };
}

export async function deleteTagAction(id: string) {
  await requireSuperAdmin();
  const result = await blogService.deleteTag(id);
  revalidatePath("/superadmin/blog/tags");
  return result;
}
