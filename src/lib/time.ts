/**
 * Time formatting for the event log (N5, C5). Event times are stored in UTC (ISO 8601);
 * the table shows the operator's local time, the detail panel also shows UTC.
 */

const LOCALE = 'uk-UA';

const DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
};

/** Local time of the workstation, e.g. "17.11.2026, 09:14:05". */
export function formatLocal(iso: string): string {
  return new Date(iso).toLocaleString(LOCALE, DATE_TIME_OPTIONS);
}

/** The same instant in UTC, e.g. "17.11.2026, 07:14:05 UTC". */
export function formatUtc(iso: string): string {
  return `${new Date(iso).toLocaleString(LOCALE, { ...DATE_TIME_OPTIONS, timeZone: 'UTC' })} UTC`;
}

/** Offset of the local time zone from UTC, e.g. "UTC+02:00". */
export function formatUtcOffset(date: Date = new Date()): string {
  const minutesEast = -date.getTimezoneOffset();
  const sign = minutesEast >= 0 ? '+' : '-';
  const abs = Math.abs(minutesEast);
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return `UTC${sign}${hh}:${mm}`;
}

/** ISO string to the value format of `<input type="datetime-local">` in local time. */
export function toLocalInputValue(iso: string): string {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

/** Value of `<input type="datetime-local">` (local time) to ISO UTC; empty input gives undefined. */
export function fromLocalInputValue(value: string): string | undefined {
  if (!value) return undefined;
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? undefined : new Date(ms).toISOString();
}
