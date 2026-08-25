import { NextResponse } from "next/server";

// TEMPORARY diagnostic route for the Liara S3 "Access Key Id does not exist"
// issue. No auth — for fast diagnosis only. Never returns key/secret values,
// only presence, length, and whitespace checks. Delete once resolved.

export async function GET() {
  const accessKey = process.env.S3_ACCESS_KEY;
  const secretKey = process.env.S3_SECRET_KEY;
  const endpoint = process.env.S3_ENDPOINT;
  const bucket = process.env.S3_BUCKET;
  const region = process.env.S3_REGION;

  return NextResponse.json({
    hasEndpoint: Boolean(endpoint),
    hasAccessKey: Boolean(accessKey),
    hasSecretKey: Boolean(secretKey),
    hasBucket: Boolean(bucket),
    endpointValue: endpoint,
    bucketValue: bucket,
    region,
    accessKeyLength: accessKey?.length ?? 0,
    secretKeyLength: secretKey?.length ?? 0,
    accessKeyHasWhitespace: accessKey ? accessKey !== accessKey.trim() : false,
    secretKeyHasWhitespace: secretKey ? secretKey !== secretKey.trim() : false,
  });
}
