# features/blog

Blog/article content management: CRUD for posts, categories, and tags from
the super-admin panel (`app/(superadmin)/superadmin/blog/*`), served on the
public marketing site's `/blog` pages.

- `repositories/blog-repository.ts` — all Prisma calls (BlogPost,
  BlogCategory, BlogTag, and the two join tables).
- `services/blog-schemas.ts` — zod validation for post/category/tag input.
- `services/slugify.ts` — pure Persian-aware slug generator (kept Persian
  letters instead of transliterating, unlike `Business.slug`). Unit-tested.
- `services/blog-service.ts` — orchestration: validates input, generates a
  unique slug, replaces category/tag links transactionally. The
  `getPublished*`/`getPublicCategories`/`getPublicTags` exports are the only
  ones the public `/blog` pages should call (status-filtered).
- `routes/actions.ts` — thin `"use server"` actions; every one calls
  `requireSuperAdmin()` before touching the service layer.

## Testing

`slugify` is pure (no I/O) — see `services/slugify.test.ts`. Everything else
here is Prisma-backed orchestration, exercised via the super-admin UI rather
than unit tests.
