import "server-only";
import { headers } from "next/headers";

type Level = "info" | "warn" | "error";

interface LogFields {
  [key: string]: unknown;
}

async function currentRequestId(): Promise<string> {
  try {
    const h = await headers();
    return h.get("x-request-id") ?? "n/a";
  } catch {
    // headers() throws outside a request scope (scripts, seed, tests).
    return "n/a";
  }
}

async function write(level: Level, event: string, fields: LogFields) {
  const line = {
    time: new Date().toISOString(),
    level,
    event,
    requestId: await currentRequestId(),
    ...fields,
  };
  const sink = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
  sink(JSON.stringify(line));
}

/**
 * Structured (JSON-line) logger. Every call is one parseable line with a
 * level, an event name, and the request id middleware.ts stamped on the
 * incoming request — grep a request id to see everything it touched.
 */
export const logger = {
  info: (event: string, fields: LogFields = {}) => void write("info", event, fields),
  warn: (event: string, fields: LogFields = {}) => void write("warn", event, fields),
  error: (event: string, fields: LogFields = {}) => void write("error", event, fields),
};
