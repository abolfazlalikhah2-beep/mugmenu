import "server-only";
import { prisma } from "@/lib/db";
import type { PostStatus } from "@/lib/generated/prisma/enums";

const postWithRelations = {
  include: {
    categories: { include: { category: true } },
    tags: { include: { tag: true } },
  },
} as const;

export function listPosts(filters: { status?: PostStatus; categoryId?: string }) {
  return prisma.blogPost.findMany({
    where: {
      status: filters.status,
      categories: filters.categoryId ? { some: { categoryId: filters.categoryId } } : undefined,
    },
    orderBy: { createdAt: "desc" },
    ...postWithRelations,
  });
}

export function getPostById(id: string) {
  return prisma.blogPost.findUnique({ where: { id }, ...postWithRelations });
}

export function getPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug }, ...postWithRelations });
}

export function findPostBySlugExcluding(slug: string, excludeId?: string) {
  return prisma.blogPost.findFirst({ where: { slug, id: excludeId ? { not: excludeId } : undefined } });
}

interface PostWriteData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  status: PostStatus;
  publishedAt: Date | null;
  seoTitle?: string;
  seoDescription?: string;
  seoNoIndex: boolean;
  canonicalUrl?: string;
  categoryIds: string[];
  tagIds: string[];
}

export async function createPost(data: PostWriteData) {
  return prisma.$transaction(async (tx) => {
    const post = await tx.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        status: data.status,
        publishedAt: data.publishedAt,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoNoIndex: data.seoNoIndex,
        canonicalUrl: data.canonicalUrl,
      },
    });
    if (data.categoryIds.length > 0) {
      await tx.blogPostCategory.createMany({
        data: data.categoryIds.map((categoryId) => ({ postId: post.id, categoryId })),
      });
    }
    if (data.tagIds.length > 0) {
      await tx.blogPostTag.createMany({ data: data.tagIds.map((tagId) => ({ postId: post.id, tagId })) });
    }
    return post;
  });
}

export async function updatePost(id: string, data: PostWriteData) {
  return prisma.$transaction(async (tx) => {
    const post = await tx.blogPost.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        status: data.status,
        publishedAt: data.publishedAt,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoNoIndex: data.seoNoIndex,
        canonicalUrl: data.canonicalUrl,
      },
    });
    await tx.blogPostCategory.deleteMany({ where: { postId: id } });
    if (data.categoryIds.length > 0) {
      await tx.blogPostCategory.createMany({
        data: data.categoryIds.map((categoryId) => ({ postId: id, categoryId })),
      });
    }
    await tx.blogPostTag.deleteMany({ where: { postId: id } });
    if (data.tagIds.length > 0) {
      await tx.blogPostTag.createMany({ data: data.tagIds.map((tagId) => ({ postId: id, tagId })) });
    }
    return post;
  });
}

export function deletePost(id: string) {
  return prisma.blogPost.delete({ where: { id } });
}

// ---------- Categories ----------

export function listCategoriesWithCount(status?: PostStatus) {
  return prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: status ? { where: { post: { status } } } : true } } },
  });
}

export function getCategoryById(id: string) {
  return prisma.blogCategory.findUnique({ where: { id } });
}

export function findCategoryBySlugExcluding(slug: string, excludeId?: string) {
  return prisma.blogCategory.findFirst({ where: { slug, id: excludeId ? { not: excludeId } : undefined } });
}

export function findCategoryByNameExcluding(name: string, excludeId?: string) {
  return prisma.blogCategory.findFirst({ where: { name, id: excludeId ? { not: excludeId } : undefined } });
}

export function createCategory(data: { name: string; slug: string }) {
  return prisma.blogCategory.create({ data });
}

export function updateCategory(id: string, data: { name: string; slug: string }) {
  return prisma.blogCategory.update({ where: { id }, data });
}

export function deleteCategory(id: string) {
  return prisma.blogCategory.delete({ where: { id } });
}

// ---------- Tags ----------

export function listTagsWithCount(status?: PostStatus) {
  return prisma.blogTag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: status ? { where: { post: { status } } } : true } } },
  });
}

export function getTagById(id: string) {
  return prisma.blogTag.findUnique({ where: { id } });
}

export function findTagBySlugExcluding(slug: string, excludeId?: string) {
  return prisma.blogTag.findFirst({ where: { slug, id: excludeId ? { not: excludeId } : undefined } });
}

export function findTagByNameExcluding(name: string, excludeId?: string) {
  return prisma.blogTag.findFirst({ where: { name, id: excludeId ? { not: excludeId } : undefined } });
}

export function createTag(data: { name: string; slug: string }) {
  return prisma.blogTag.create({ data });
}

export function updateTag(id: string, data: { name: string; slug: string }) {
  return prisma.blogTag.update({ where: { id }, data });
}

export function deleteTag(id: string) {
  return prisma.blogTag.delete({ where: { id } });
}

// ---------- Public (published-only) reads ----------

export function getPublishedPosts() {
  return prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    ...postWithRelations,
  });
}

export function getPublishedPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({ where: { slug, status: "PUBLISHED" }, ...postWithRelations });
}
