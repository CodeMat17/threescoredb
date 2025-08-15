import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extract a concise, user-friendly error message from errors that may include
 * framework-specific prefixes (e.g., Convex error wrappers).
 */
export function extractErrorMessage(error: unknown): string {
  const fallback = "Something went wrong";
  if (!error) return fallback;
  const raw = error instanceof Error ? error.message : String(error);

  // Common Convex error prefixes and wrappers
  let msg = raw
    // Drop leading Convex metadata like: [CONVEX M(...)] [Request ID: ...]
    .replace(/^\[CONVEX[^\]]*\]\s*/g, "")
    .replace(/^\[Request ID:[^\]]*\]\s*/g, "")
    .replace(/^Server Error\s*/i, "")
    .replace(/Called by client\s*$/i, "");

  // If it contains "Uncaught Error: <message>" capture that message
  const uncaughtMatch = msg.match(/Uncaught Error:\s*([^\n]*?)(?:\s+at\s+|$)/i);
  if (uncaughtMatch && uncaughtMatch[1]) {
    return uncaughtMatch[1].trim() || fallback;
  }

  // Otherwise, strip any trailing stack location like: " at handler (../file.ts:line:col)"
  // Avoid dotAll flag for broader TS target support; use [\s\S] instead of .
  msg = msg.replace(/\s+at\s+[\s\S]*$/, "").trim();

  // If the message still contains multiple segments separated by ": ", pick the last meaningful part
  const parts = msg
    .split(": ")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length > 1) return parts[parts.length - 1];

  return msg || fallback;
}
