import "server-only";
import { randomUUID } from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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
  const missing = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(
      `آپلود تصویر پیکربندی نشده است. این متغیرهای محیطی را در .env تنظیم کنید: ${missing.join(", ")}`
    );
  }
  return {
    endpoint: process.env.S3_ENDPOINT!,
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
    bucket: process.env.S3_BUCKET!,
    region: process.env.S3_REGION || "us-east-1",
    publicUrl: process.env.S3_PUBLIC_URL || undefined,
  };
}

let client: S3Client | null = null;
let clientConfigKey = "";

function getClient(config: StorageConfig): S3Client {
  const key = `${config.endpoint}:${config.accessKeyId}`;
  if (!client || clientConfigKey !== key) {
    client = new S3Client({
      endpoint: config.endpoint,
      region: config.region,
      credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
      // Required for MinIO and most S3-compatible providers, which serve
      // buckets at <endpoint>/<bucket>/<key> rather than <bucket>.<endpoint>.
      forcePathStyle: true,
    });
    clientConfigKey = key;
  }
  return client;
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
 * Uploads a file and returns its public URL. The bucket itself must be
 * configured for public read (bucket policy / public bucket setting) —
 * this does not set a per-object ACL, since several S3-compatible
 * providers reject or ignore the `x-amz-acl` header.
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
    throw new Error(`آپلود به فضای ذخیره‌سازی S3 با خطا مواجه شد: ${describeUploadError(e)}`);
  }

  const base = config.publicUrl?.replace(/\/$/, "") ?? `${config.endpoint.replace(/\/$/, "")}/${config.bucket}`;
  return `${base}/${key}`;
}
