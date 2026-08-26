import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : undefined));

export const postSchema = z.object({
  title: z.string().trim().min(3, "عنوان را کامل وارد کنید.").max(200),
  // Blank means "auto-generate from title" — see blog-service.ts.
  slug: z.string().trim().max(200).optional(),
  excerpt: z.string().trim().min(10, "خلاصه را کامل وارد کنید.").max(500),
  content: z.string().trim().min(20, "متن مقاله را کامل وارد کنید."),
  coverImage: optionalUrl,
  status: z.enum(["DRAFT", "PUBLISHED"]),
  // ISO date ("YYYY-MM-DD") from a date input; empty means "not scheduled yet".
  publishedAt: z.string().trim().optional(),
  categoryIds: z.array(z.string().min(1)),
  tagIds: z.array(z.string().min(1)),
  seoTitle: z.string().trim().max(70).optional().or(z.literal("")).transform((v) => (v ? v : undefined)),
  seoDescription: z
    .string()
    .trim()
    .max(160)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  seoNoIndex: z.boolean(),
  canonicalUrl: optionalUrl,
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "نام دسته را کامل وارد کنید.").max(60),
});

export const tagSchema = z.object({
  name: z.string().trim().min(2, "نام برچسب را کامل وارد کنید.").max(40),
});
