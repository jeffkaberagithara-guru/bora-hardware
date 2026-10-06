/** Minimal class joiner. Deliberately not a dependency — 12 characters of need. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}