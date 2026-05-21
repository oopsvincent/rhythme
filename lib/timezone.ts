/**
 * =============================================================================
 * TIMEZONE UTILITIES
 * =============================================================================
 *
 * Central module for all timezone-aware date operations in Rhythmé.
 *
 * CONVENTION:
 *   - NEVER use `new Date().toISOString().split('T')[0]` to get "today".
 *     Always use `getLocalDateString()` from this module.
 *   - Store timestamps as UTC (`new Date().toISOString()`) — this is correct.
 *   - Store `local_date` (YYYY-MM-DD) alongside timestamps when the user's
 *     calendar day matters (journals, mood logs, daily habits).
 *   - Store `timezone` (IANA string) on records where day-boundary matters.
 *   - Server actions that need "today" must receive it from the client.
 *   - ML endpoints must receive `user_timezone` and `local_date` explicitly.
 *
 * =============================================================================
 */

/**
 * Returns the user's IANA timezone string from the browser.
 * e.g. "Asia/Kolkata", "America/New_York", "Europe/London"
 *
 * Falls back to "UTC" in non-browser environments (SSR safety).
 */
export function getUserTimezone(): string {
  if (typeof window === "undefined") return "UTC"
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return "UTC"
  }
}

/**
 * Returns a date as "YYYY-MM-DD" in the user's local timezone.
 * This is the ONLY correct way to get "today" for data operations.
 *
 * @param date - Optional Date object. Defaults to now.
 * @returns e.g. "2026-05-21"
 */
export function getLocalDateString(date?: Date): string {
  const d = date ?? new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/**
 * Returns an ISO-ish string for the start of today in the user's local timezone.
 * Useful for Supabase range queries where you want "today" relative to the user.
 *
 * @returns e.g. "2026-05-21T00:00:00.000" (no Z — local interpretation)
 */
export function getStartOfTodayISO(date?: Date): string {
  const d = date ?? new Date()
  const dateStr = getLocalDateString(d)
  return `${dateStr}T00:00:00.000`
}

/**
 * Returns an ISO-ish string for the end of today in the user's local timezone.
 *
 * @returns e.g. "2026-05-21T23:59:59.999"
 */
export function getEndOfTodayISO(date?: Date): string {
  const d = date ?? new Date()
  const dateStr = getLocalDateString(d)
  return `${dateStr}T23:59:59.999`
}

/**
 * Safely parses a UTC date string (even one lacking a 'Z' or offset) into a Date object.
 */
export function parseUTCDate(date: string | Date): Date {
  if (date instanceof Date) return date;
  if (!date) return new Date();

  // If it's already an ISO string with Z or timezone offset at the end, parse it directly
  if (date.endsWith("Z") || /[+-]\d{2}(:?\d{2})?$/.test(date)) {
    return new Date(date);
  }

  // If it has 'T' separator, append 'Z'
  if (date.includes("T")) {
    return new Date(`${date}Z`);
  }

  // If it is in format "YYYY-MM-DD HH:MM:SS", convert to "YYYY-MM-DDTHH:MM:SSZ"
  if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/.test(date)) {
    return new Date(`${date.replace(" ", "T")}Z`);
  }

  // Fallback: append 'Z' if it doesn't look like it has offset/Z
  return new Date(`${date}Z`);
}

/**
 * Formats a date/timestamp for display in the user's local timezone.
 * Returns a human-readable date string.
 *
 * @param date - ISO string or Date object
 * @param options - Optional Intl.DateTimeFormat options
 * @returns e.g. "May 21, 2026"
 */
export function toLocalDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = parseUTCDate(date)
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  })
}

/**
 * Formats a date/timestamp to a full date and time string in the user's local timezone.
 *
 * @param date - ISO string or Date object
 * @param options - Optional Intl.DateTimeFormat options
 * @returns e.g. "5/21/2026, 9:20:11 PM"
 */
export function toLocalDateTimeString(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = parseUTCDate(date)
  return d.toLocaleString(undefined, options)
}

/**
 * Returns UTC offset string for display purposes.
 * e.g. "UTC+05:30", "UTC-04:00", "UTC+00:00"
 */
export function getUTCOffsetString(): string {
  const offset = new Date().getTimezoneOffset() // in minutes, sign-inverted
  const sign = offset <= 0 ? "+" : "-"
  const absOffset = Math.abs(offset)
  const hours = String(Math.floor(absOffset / 60)).padStart(2, "0")
  const minutes = String(absOffset % 60).padStart(2, "0")
  return `UTC${sign}${hours}:${minutes}`
}

/**
 * Returns the user's local hour (0-23). SSR-safe.
 * On the server, returns -1 to signal "unknown".
 */
export function getLocalHour(): number {
  if (typeof window === "undefined") return -1
  return new Date().getHours()
}
