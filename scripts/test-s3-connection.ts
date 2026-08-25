import "dotenv/config";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

// TEMPORARY diagnostic script for the Liara S3 "Access Key Id does not
// exist" issue. Bypasses the app entirely — same client config as
// features/uploads/services/storage-service.ts. Run with:
//   npx tsx scripts/test-s3-connection.ts
// Delete once the upload issue is resolved.

function describeError(e: unknown) {
  if (e instanceof Error) {
    const err = e as Error & {
      Code?: string;
      $metadata?: { httpStatusCode?: number };
    };
    return {
      name: err.name,
      message: err.message,
      code: err.Code ?? (err as { code?: string }).code,
      httpStatusCode: err.$metadata?.httpStatusCode,
    };
  }
  return { message: String(e) };
}

async function main() {
  const endpoint = process.env.S3_ENDPOINT;
  const accessKeyId = process.env.S3_ACCESS_KEY;
  const secretAccessKey = process.env.S3_SECRET_KEY;
  const bucket = process.env.S3_BUCKET;
  const region = process.env.S3_REGION || "us-east-1";

  console.log("Config presence:", {
    hasEndpoint: Boolean(endpoint),
    hasAccessKey: Boolean(accessKeyId),
    hasSecretKey: Boolean(secretAccessKey),
    hasBucket: Boolean(bucket),
    accessKeyLength: accessKeyId?.length ?? 0,
    secretKeyLength: secretAccessKey?.length ?? 0,
    accessKeyHasWhitespace: accessKeyId ? accessKeyId !== accessKeyId.trim() : false,
    secretKeyHasWhitespace: secretAccessKey ? secretAccessKey !== secretAccessKey.trim() : false,
    region,
  });

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
    console.error("Missing required env var(s) — aborting.");
    process.exit(1);
  }

  const client = new S3Client({
    endpoint,
    region,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  });

  try {
    const result = await client.send(new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 5 }));
    console.log("SUCCESS — bucket reachable, key authorized for ListObjectsV2.");
    console.log("Object count returned:", result.Contents?.length ?? 0);
  } catch (e) {
    console.error("FAILED —", describeError(e));
    process.exit(1);
  }
}

main();
