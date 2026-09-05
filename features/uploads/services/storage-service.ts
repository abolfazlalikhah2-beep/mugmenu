import "server-only";
import { randomUUID } from "crypto";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { logger } from "@/lib/logger";

/**
 * S3-compatible object storage (MinIO locally, ArvanCloud/Liara/etc. in
 * production — see CLAUDE.md). Required env vars match the placeholders
 * already in .env.example; S3_REGION and S3_PUBLIC_URL are optional
 * extras some providers need (a public/CDN domain that differs from the
 * upload endpoint, or a region string the API requires even if unused).
 */
const REQUIRED_ENV_VARS = ["S3_ENDPOINT", "S3_ACCESS_KEY", "S3_SECRET_KEY", "S3_BUCKET"] as const;

interface StorageConfig {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  region: string;
  publicUrl?: string;
}

function readConfig(): StorageConfig {
  console.log(
    "S3 Config:",
    Object.fromEntries(REQUIRED_ENV_VARS.map((name) => [name, Boolean(process.env[name])]))
  );

  const missing = REQUIRED_ENV_VARS.filter((name) => !process.env[name]?.trim());
  if (missing.length > 0) {
    throw new Error(
      `آپلود تصویر پیکربندی نشده است. این متغیرهای محیطی را در .env تنظیم کنید: ${missing.join(", ")}`
    );
  }
  return {
    endpoint: process.env.S3_ENDPOINT!.trim(),
    accessKeyId: process.env.S3_ACCESS_KEY!.trim(),
    secretAccessKey: process.env.S3_SECRET_KEY!.trim(),
    bucket: process.env.S3_BUCKET!.trim(),
    region: (process.env.S3_REGION || "us-east-1").trim(),
    publicUrl: process.env.S3_PUBLIC_URL?.trim() || undefined,
  };
}

function getClient(config: StorageConfig): S3Client {
  logger.info("uploads.s3_client_init", {
    endpoint: config.endpoint,
    region: config.region,
    accessKeyPrefix: config.accessKeyId.substring(0, 4),
    bucket: config.bucket,
  });
  return new S3Client({
    endpoint: config.endpoint.replace(/\/$/, ""),
    region: config.region,
    credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
    // Required for MinIO and most S3-compatible providers, which serve
    // buckets at <endpoint>/<bucket>/<key> rather than <bucket>.<endpoint>.
    forcePathStyle: true,
  });
}

export interface UploadImageInput {
  kind: string;
  businessId: string;
  buffer: Buffer;
  contentType: string;
  extension: string;
}

/**
 * Network-level S3 client failures (e.g. ECONNREFUSED when the endpoint is
 * unreachable) surface as an `AggregateError` with an empty top-level
 * `.message` — the real reason is nested one level down in `.errors`. Left
 * as-is, that empty string makes the failure look silent all the way up
 * through uploadImageAction and ImageUploadField (both only show an error
 * when the message is truthy), so this always returns something non-empty.
 */
function describeUploadError(e: unknown): string {
  if (e instanceof Error) {
    if (e.message) return e.message;
    const nested = (e as { errors?: unknown[] }).errors;
    if (Array.isArray(nested) && nested.length > 0) {
      const first = nested[0];
      if (first instanceof Error && first.message) return first.message;
      const code = (first as { code?: string } | undefined)?.code;
      if (code) return code;
    }
    if (e.name) return e.name;
  }
  return String(e);
}

/**
 * Uploads a file and returns its public URL. Object keys are namespaced by
 * kind/businessId and end in a randomUUID(), so paths aren't guessable/
 * enumerable — that's this app's only control over exposure, since object
 * ACLs aren't set here (see below).
 *
 * The bucket itself must be configured, in the Liara panel (or whichever
 * S3-compatible provider), for:
 *   - public READ on objects (bucket policy / "public bucket" setting) —
 *     this function does not set a per-object ACL, since several
 *     S3-compatible providers reject or ignore the `x-amz-acl` header.
 *   - public LIST/ListBucket must stay DENIED — public read alone lets
 *     someone fetch a key they already have; public listing would let them
 *     enumerate every uploaded file (other businesses' product/logo images,
 *     ticket attachments) without ever guessing a UUID. This can't be
 *     fixed from application code — it's a bucket policy setting.
 */
export async function uploadImage(input: UploadImageInput): Promise<string> {
  const config = readConfig();
  const s3 = getClient(config);
  const key = `${input.kind}/${input.businessId}/${randomUUID()}.${input.extension}`;

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        Body: input.buffer,
        ContentType: input.contentType,
      })
    );
  } catch (e) {
    const err = e as {
      name?: string;
      Code?: string;
      $fault?: string;
      $metadata?: { httpStatusCode?: number; requestId?: string };
      message?: string;
    };
    logger.error("uploads.s3_raw_error", {
      errorName: err?.name,
      errorCode: err?.Code || err?.$fault,
      httpStatus: err?.$metadata?.httpStatusCode,
      requestId: err?.$metadata?.requestId,
      message: err?.message,
    });
    throw new Error(`آپلود به فضای ذخیره‌سازی S3 با خطا مواجه شد: ${describeUploadError(e)}`);
  }

  const base = config.publicUrl?.replace(/\/$/, "") ?? `${config.endpoint.replace(/\/$/, "")}/${config.bucket}`;
  const publicUrl = `${base}/${key}`;
  // uploads.s3_client_init only logs config.endpoint (the internal upload
  // endpoint, always S3_ENDPOINT by design — PUT requests go there, not the
  // public CDN domain). It does NOT reveal what URL actually gets saved to
  // the DB. Log that explicitly so "which domain did this upload end up
  // with" is answerable from logs instead of inferred from the wrong field.
  logger.info("uploads.image_url_resolved", {
    key,
    usedPublicUrl: Boolean(config.publicUrl),
    publicUrl,
  });
  return publicUrl;
}

export interface PresignedUploadInput {
  kind: string;
  businessId: string;
  contentType: string;
  extension: string;
}

export interface PresignedUploadResult {
  presignedUrl: string;
  publicUrl: string;
}

/**
 * Presigned PUT URL so the browser can upload straight to S3, bypassing
 * Next.js Server Actions (and Liara's proxy, which ignores the configured
 * serverActions.bodySizeLimit and 413s uploads over ~1MB regardless — see
 * next.config.ts). Same key layout as uploadImage() above; short expiry
 * since the browser is expected to PUT immediately after requesting it.
 */
export async function createPresignedUploadUrl(input: PresignedUploadInput): Promise<PresignedUploadResult> {
  const config = readConfig();
  const s3 = getClient(config);
  const key = `${input.kind}/${input.businessId}/${randomUUID()}.${input.extension}`;

  const presignedUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: config.bucket, Key: key, ContentType: input.contentType }),
    { expiresIn: 60 }
  );

  const base = config.publicUrl?.replace(/\/$/, "") ?? `${config.endpoint.replace(/\/$/, "")}/${config.bucket}`;
  const publicUrl = `${base}/${key}`;
  logger.info("uploads.presigned_url_created", { key, kind: input.kind, businessId: input.businessId });
  return { presignedUrl, publicUrl };
}

/**
 * Deletes one object from the bucket. Best-effort: callers use this to clean
 * up an old image right after replacing it, and a stray unreferenced file in
 * S3 is a much smaller problem than blocking/failing the caller's own update
 * over a storage-provider hiccup — so this logs and swallows errors instead
 * of throwing.
 */
export async function deleteFromS3(key: string): Promise<void> {
  const config = readConfig();
  const s3 = getClient(config);

  try {
    await s3.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }));
    logger.info("uploads.image_deleted", { key });
  } catch (e) {
    logger.error("uploads.image_delete_failed", { key, error: describeUploadError(e) });
  }
}

/**
 * Recovers the S3 object key from a URL previously returned by uploadImage()
 * — strips whichever base was used to build it (the CDN S3_PUBLIC_URL, or
 * S3_ENDPOINT/S3_BUCKET when no public URL is configured), so it works
 * regardless of which one was active when the object was originally uploaded.
 */
function keyFromPublicUrl(url: string): string | null {
  let pathname: string;
  try {
    pathname = new URL(url).pathname.replace(/^\//, "");
  } catch {
    return null;
  }

  const config = readConfig();
  const bucketPrefix = `${config.bucket}/`;
  if (pathname.startsWith(bucketPrefix)) {
    pathname = pathname.slice(bucketPrefix.length);
  }
  return pathname || null;
}

/** Convenience wrapper for the common "delete whatever this URL points to" case — see deleteFromS3. */
export async function deleteImageByUrl(url: string): Promise<void> {
  const key = keyFromPublicUrl(url);
  if (!key) {
    logger.error("uploads.image_delete_skipped_unparseable_url", { url });
    return;
  }
  await deleteFromS3(key);
}
