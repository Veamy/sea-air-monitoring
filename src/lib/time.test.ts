import { describe, expect, it } from 'vitest';
import {
  formatLocal,
  formatUtc,
  formatUtcOffset,
  fromLocalInputValue,
  toLocalInputValue,
} from './time';

describe('time formatting', () => {
  const iso = '2026-11-17T07:14:05.000Z';

  it('shows UTC with the explicit suffix and the same clock time', () => {
    expect(formatUtc(iso)).toBe('17.11.2026, 07:14:05 UTC');
  });

  it('shows local time as a date-time string in the Ukrainian format', () => {
    expect(formatLocal(iso)).toMatch(/^\d{2}\.11\.2026, \d{2}:14:05$/);
  });

  it('formats the offset of the given date as UTC±hh:mm', () => {
    expect(formatUtcOffset(new Date(iso))).toMatch(/^UTC[+-]\d{2}:\d{2}$/);
  });
});

describe('datetime-local conversion', () => {
  it('round-trips a local value without losing minutes', () => {
    const local = '2026-11-17T09:30';
    const iso = fromLocalInputValue(local);
    expect(iso).toBeDefined();
    expect(toLocalInputValue(iso!)).toBe(local);
  });

  it('returns undefined for an empty or invalid value', () => {
    expect(fromLocalInputValue('')).toBeUndefined();
    expect(fromLocalInputValue('not a date')).toBeUndefined();
  });
});
