import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { createPresignedUploadUrl } from "@/features/uploads/services/storage-service";
import { uploadKindSchema, EXTENSION_BY_MIME_TYPE } from "@/features/uploads/services/upload-schemas";
import { z } from "zod";

const bodySchema = z.object({
  filename: z.string().min(1),
  contentType: z.enum(Object.keys(EXTENSION_BY_MIME_TYPE) as [string, ...string[]], {
    message: "فقط تصاویر jpg، png یا webp مجاز است.",
  }),
  kind: uploadKindSchema,
});

/**
 * Presigned S3 upload URL so the browser uploads the file directly to S3,
 * bypassing Next.js Server Actions entirely — Liara's proxy 413s Server
 * Action bodies over ~1MB regardless of next.config.ts's serverActions
 * .bodySizeLimit (see features/uploads/services/storage-service.ts).
 */
export async function POST(request: Request) {
  const { businessId } = await requireBusinessOwner();

  const raw = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { contentType, kind } = parsed.data;

  try {
    const { presignedUrl, publicUrl } = await createPresignedUploadUrl({
      kind,
      businessId,
      contentType,
      extension: EXTENSION_BY_MIME_TYPE[contentType as keyof typeof EXTENSION_BY_MIME_TYPE],
    });
    logger.info("uploads.presign_requested", { businessId, kind });
    return NextResponse.json({ presignedUrl, publicUrl });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    logger.error("uploads.presign_failed", { businessId, kind, error: message });
    return NextResponse.json({ error: message || "دریافت لینک آپلود با خطا مواجه شد." }, { status: 500 });
  }
}
