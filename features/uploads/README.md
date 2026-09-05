# Uploads

Image upload to S3-compatible object storage (MinIO locally, ArvanCloud/Liara/etc.
in production), used by the dashboard (product/category images, business logo).

## Layers

- `services/storage-service.ts` — the only file that touches the S3 client. Reads
  `S3_ENDPOINT`/`S3_ACCESS_KEY`/`S3_SECRET_KEY`/`S3_BUCKET` from env (throws a clear
  error naming any missing var); `S3_REGION`/`S3_PUBLIC_URL` are optional.
  `deleteImageByUrl(url)` (or the lower-level `deleteFromS3(key)`) removes an
  object — best-effort, it logs and swallows errors instead of throwing, since a
  stray unreferenced file is a much smaller problem than blocking the caller's
  own update over a storage hiccup. The product/category/menu-appearance dashboard
  services call it after a successful update to clean up the image that was just
  replaced (see `features/dashboard/services/{product,category,settings}-service.ts`).
- `services/upload-schemas.ts` — zod validation for the upload kind (`products` /
  `categories` / `logos`, used as the S3 key prefix) and the file itself (jpg/png/webp,
  max 5MB).
- `routes/actions.ts` — `uploadImageAction(kind, formData)`, the one `"use server"`
  action. Calls `requireBusinessOwner()` first — only a signed-in business owner can
  upload — then validates and uploads, returning `{ url }` or `{ error }`.

## Client usage

`components/uploads/image-upload-field.tsx` wraps this action: it uploads on file
select and writes the resulting URL into a hidden `<input>`, so the surrounding
form (product modal, category modal, onboarding) picks it up like any other field —
no changes needed to how those forms submit.

## How to test

```bash
npm run dev
# needs a real S3-compatible bucket — see .env.example for the required vars.
# then: /dashboard/products → new/edit product → pick an image → save,
# and confirm the image shows on /<slug>/menu and the item detail page.
```
