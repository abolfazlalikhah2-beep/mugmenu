import { NextResponse } from "next/server";
import { submitContactMessage } from "@/features/contact/services/contact-service";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "بدنه درخواست نامعتبر است." }, { status: 400 });
  }

  const result = await submitContactMessage(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error, fieldErrors: result.fieldErrors }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
