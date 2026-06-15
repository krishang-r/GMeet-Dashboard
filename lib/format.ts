/** Formats a meeting time for display, or returns null when there's no
 *  scheduled time (instant / recurring meets). */
export function formatSchedule(date: Date | null | undefined): string | null {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

/** Converts a Date to the value a <input type="datetime-local"> expects
 *  (YYYY-MM-DDTHH:mm), or "" when there's no date. */
export function toDateTimeLocal(date: Date | null | undefined): string {
  if (!date) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
