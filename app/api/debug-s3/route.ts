import { NextRequest, NextResponse } from "next/server";

// TEMPORARY diagnostic route for the Liara S3 "Access Key Id does not exist"
// issue — masks secrets, never logs full values. Delete this file once the
// S3 env vars are confirmed correct in the Liara panel.

const DEBUG_SECRET = "serv-debug-2024";

function mask(value: string | undefined): { masked: string; length: number } {
  if (!value) return { masked: "(unset)", length: 0 };
  if (value.length <= 10) return { masked: "***", length: value.length };
  return { masked: `${value.slice(0, 6)}...${value.slice(-4)}`, length: value.length };
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== DEBUG_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const accessKey = mask(process.env.S3_ACCESS_KEY);
  const secretKey = mask(process.env.S3_SECRET_KEY);
  const endpoint = process.env.S3_ENDPOINT;
  const bucket = process.env.S3_BUCKET;
  const region = process.env.S3_REGION;

  return NextResponse.json({
    S3_ACCESS_KEY: { masked: accessKey.masked, length: accessKey.length },
    S3_SECRET_KEY: { masked: secretKey.masked, length: secretKey.length },
    S3_ENDPOINT: { value: endpoint ?? "(unset)", length: endpoint?.length ?? 0 },
    S3_BUCKET: { value: bucket ?? "(unset)", length: bucket?.length ?? 0 },
    S3_REGION: { value: region ?? "(unset)", length: region?.length ?? 0 },
  });
}
