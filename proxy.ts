import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Stamps every request with an id so lib/logger.ts can correlate every log
// line touched by one request (Server Components, Route Handlers, and
// Server Actions all see the same header).
export function proxy(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const headers = new Headers(request.headers);
  headers.set("x-request-id", requestId);

  const response = NextResponse.next({ request: { headers } });
  response.headers.set("x-request-id", requestId);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
