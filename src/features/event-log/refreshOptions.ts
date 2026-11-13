/** Refresh intervals in milliseconds; 0 turns auto-refresh off (R3). */
export const REFRESH_OPTIONS = [
  { value: 0, text: 'Вимкнено' },
  { value: 10_000, text: 'кожні 10 с' },
  { value: 30_000, text: 'кожні 30 с' },
  { value: 60_000, text: 'кожну хвилину' },
] as const;

export const DEFAULT_REFRESH_MS = 30_000;
