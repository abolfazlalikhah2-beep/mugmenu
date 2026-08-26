import "server-only";
import { logger } from "@/lib/logger";
import * as repo from "@/features/blog/repositories/blog-repository";
import { slugify } from "@/features/blog/services/slugify";
import { postSchema, categorySchema, tagSchema } from "@/features/blog/services/blog-schemas";
import type { PostStatus } from "@/lib/generated/prisma/enums";

export type ServiceResult = { ok: true } | { ok: false; error: string };
export type CreateResult = { ok: true; id: string } | { ok: false; error: string };

async function ensureUniqueSlug(base: string, isTaken: (slug: string) => Promise<boolean>): Promise<string> {
  const root = base || "post";
  let candidate = root;
  let n = 2;
  while (await isTaken(candidate)) {
    candidate = `${root}-${n}`;
    n += 1;
  }
  return candidate;
}

function parsePublishedAt(raw: string | undefined, status: PostStatus): Date | null {
  if (raw) {
    const date = new Date(raw);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return status === "PUBLISHED" ? new Date() : null;
}

// ---------- Posts ----------

export function getPostsForAdmin(filters: { status?: PostStatus; categoryId?: string }) {
  return repo.listPosts(filters);
}

export function getPostForEdit(id: string) {
  return repo.getPostById(id);
}

export async function createPost(input: unknown): Promise<CreateResult> {
  const parsed = postSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  const baseSlug = slugify(data.slug || data.title);
  const slug = await ensureUniqueSlug(baseSlug, async (candidate) => !!(await repo.findPostBySlugExcluding(candidate)));

  const post = await repo.createPost({
    title: data.title,
    slug,
    excerpt: data.excerpt,
    content: data.content,
    coverImage: data.coverImage,
    status: data.status,
    publishedAt: parsePublishedAt(data.publishedAt, data.status),
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    seoNoIndex: data.seoNoIndex,
    canonicalUrl: data.canonicalUrl,
    categoryIds: data.categoryIds,
    tagIds: data.tagIds,
  });
  logger.info("blog.post_created", { postId: post.id, status: post.status });
  return { ok: true, id: post.id };
}

export async function updatePost(id: string, input: unknown): Promise<ServiceResult> {
  const existing = await repo.getPostById(id);
  if (!existing) return { ok: false, error: "مقاله پیدا نشد." };

  const parsed = postSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  const baseSlug = slugify(data.slug || data.title);
  const slug = await ensureUniqueSlug(baseSlug, async (candidate) => {
    const found = await repo.findPostBySlugExcluding(candidate, id);
    return !!found;
  });

  await repo.updatePost(id, {
    title: data.title,
    slug,
    excerpt: data.excerpt,
    content: data.content,
    coverImage: data.coverImage,
    status: data.status,
    publishedAt: parsePublishedAt(data.publishedAt, data.status),
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    seoNoIndex: data.seoNoIndex,
    canonicalUrl: data.canonicalUrl,
    categoryIds: data.categoryIds,
    tagIds: data.tagIds,
  });
  logger.info("blog.post_updated", { postId: id, status: data.status });
  return { ok: true };
}

export async function deletePost(id: string): Promise<ServiceResult> {
  const existing = await repo.getPostById(id);
  if (!existing) return { ok: false, error: "مقاله پیدا نشد." };
  await repo.deletePost(id);
  logger.info("blog.post_deleted", { postId: id });
  return { ok: true };
}

// ---------- Categories ----------

export function getCategoriesWithCount() {
  return repo.listCategoriesWithCount();
}

export async function createCategory(input: unknown): Promise<CreateResult> {
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  if (await repo.findCategoryByNameExcluding(parsed.data.name)) {
    return { ok: false, error: "دسته‌ای با این نام قبلاً ثبت شده است." };
  }

  const slug = await ensureUniqueSlug(slugify(parsed.data.name), async (candidate) => {
    const found = await repo.findCategoryBySlugExcluding(candidate);
    return !!found;
  });
  const category = await repo.createCategory({ name: parsed.data.name, slug });
  logger.info("blog.category_created", { categoryId: category.id });
  return { ok: true, id: category.id };
}

export async function updateCategory(id: string, input: unknown): Promise<ServiceResult> {
  const existing = await repo.getCategoryById(id);
  if (!existing) return { ok: false, error: "دسته پیدا نشد." };

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  if (parsed.data.name !== existing.name && (await repo.findCategoryByNameExcluding(parsed.data.name, id))) {
    return { ok: false, error: "دسته‌ای با این نام قبلاً ثبت شده است." };
  }

  const slug =
    parsed.data.name === existing.name
      ? existing.slug
      : await ensureUniqueSlug(slugify(parsed.data.name), async (candidate) => {
          const found = await repo.findCategoryBySlugExcluding(candidate, id);
          return !!found;
        });

  await repo.updateCategory(id, { name: parsed.data.name, slug });
  logger.info("blog.category_updated", { categoryId: id });
  return { ok: true };
}

export async function deleteCategory(id: string): Promise<ServiceResult> {
  const existing = await repo.getCategoryById(id);
  if (!existing) return { ok: false, error: "دسته پیدا نشد." };
  await repo.deleteCategory(id);
  logger.info("blog.category_deleted", { categoryId: id });
  return { ok: true };
}

// ---------- Tags ----------

export function getTagsWithCount() {
  return repo.listTagsWithCount();
}

export async function createTag(input: unknown): Promise<CreateResult> {
  const parsed = tagSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  if (await repo.findTagByNameExcluding(parsed.data.name)) {
    return { ok: false, error: "برچسبی با این نام قبلاً ثبت شده است." };
  }

  const slug = await ensureUniqueSlug(slugify(parsed.data.name), async (candidate) => {
    const found = await repo.findTagBySlugExcluding(candidate);
    return !!found;
  });
  const tag = await repo.createTag({ name: parsed.data.name, slug });
  logger.info("blog.tag_created", { tagId: tag.id });
  return { ok: true, id: tag.id };
}

export async function updateTag(id: string, input: unknown): Promise<ServiceResult> {
  const existing = await repo.getTagById(id);
  if (!existing) return { ok: false, error: "برچسب پیدا نشد." };

  const parsed = tagSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  if (parsed.data.name !== existing.name && (await repo.findTagByNameExcluding(parsed.data.name, id))) {
    return { ok: false, error: "برچسبی با این نام قبلاً ثبت شده است." };
  }

  const slug =
    parsed.data.name === existing.name
      ? existing.slug
      : await ensureUniqueSlug(slugify(parsed.data.name), async (candidate) => {
          const found = await repo.findTagBySlugExcluding(candidate, id);
          return !!found;
        });

  await repo.updateTag(id, { name: parsed.data.name, slug });
  logger.info("blog.tag_updated", { tagId: id });
  return { ok: true };
}

export async function deleteTag(id: string): Promise<ServiceResult> {
  const existing = await repo.getTagById(id);
  if (!existing) return { ok: false, error: "برچسب پیدا نشد." };
  await repo.deleteTag(id);
  logger.info("blog.tag_deleted", { tagId: id });
  return { ok: true };
}

// ---------- Public (published-only) ----------

export function getPublishedPosts() {
  return repo.getPublishedPosts();
}

export function getPublishedPostBySlug(slug: string) {
  return repo.getPublishedPostBySlug(slug);
}

export async function getPublicCategories() {
  const categories = await repo.listCategoriesWithCount("PUBLISHED");
  return categories.filter((c) => c._count.posts > 0);
}

export async function getPublicTags() {
  const tags = await repo.listTagsWithCount("PUBLISHED");
  return tags.filter((t) => t._count.posts > 0);
}
