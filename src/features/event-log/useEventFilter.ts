import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  EMPTY_FILTER,
  EVENT_STATUSES,
  EVENT_TYPES,
  type EventFilter,
  type EventStatus,
  type EventType,
} from '../../domain/event';

/**
 * Filter and selection live in the URL query string (report 2.6). They survive
 * auto-refresh and reloads, and the URL can be shared with another operator.
 */
const PARAM = {
  type: 'type',
  zone: 'zone',
  status: 'status',
  from: 'from',
  to: 'to',
  text: 'q',
  selected: 'event',
} as const;

function pick<T extends string>(values: readonly T[], raw: string | null): T | '' {
  return values.includes(raw as T) ? (raw as T) : '';
}

export interface EventFilterState {
  /** Filter in the shape used by the domain layer (applyFilter). */
  filter: EventFilter;
  /** Raw values of the single-choice controls, '' means "all". */
  type: EventType | '';
  zoneId: string;
  status: EventStatus | '';
  /** Local date-time values of the datetime-local inputs. */
  fromLocal: string;
  toLocal: string;
  text: string;
  selectedId: string | null;
  setParam: (key: keyof typeof PARAM, value: string) => void;
  clearFilters: () => void;
  select: (id: string | null) => void;
}

/** Reads and writes the event filter and the selected event through the URL. */
export function useEventFilter(): EventFilterState {
  const [params, setParams] = useSearchParams();

  const type = pick(EVENT_TYPES, params.get(PARAM.type));
  const status = pick(EVENT_STATUSES, params.get(PARAM.status));
  const zoneId = params.get(PARAM.zone) ?? '';
  const fromLocal = params.get(PARAM.from) ?? '';
  const toLocal = params.get(PARAM.to) ?? '';
  const text = params.get(PARAM.text) ?? '';
  const selectedId = params.get(PARAM.selected);

  const filter = useMemo<EventFilter>(
    () => ({
      ...EMPTY_FILTER,
      types: type ? [type] : [],
      statuses: status ? [status] : [],
      zoneIds: zoneId ? [zoneId] : [],
      from: fromLocal ? toIso(fromLocal) : undefined,
      to: toLocal ? toIso(toLocal) : undefined,
      text,
    }),
    [type, status, zoneId, fromLocal, toLocal, text],
  );

  const setParam = useCallback(
    (key: keyof typeof PARAM, value: string) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value) next.set(PARAM[key], value);
          else next.delete(PARAM[key]);
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const clearFilters = useCallback(() => {
    // Keeps the selected event: clearing filters must not lose the operator's place (R3, R5).
    setParams(
      (prev) => {
        const next = new URLSearchParams();
        const selected = prev.get(PARAM.selected);
        if (selected) next.set(PARAM.selected, selected);
        return next;
      },
      { replace: true },
    );
  }, [setParams]);

  const select = useCallback((id: string | null) => setParam('selected', id ?? ''), [setParam]);

  return {
    filter,
    type,
    zoneId,
    status,
    fromLocal,
    toLocal,
    text,
    selectedId,
    setParam,
    clearFilters,
    select,
  };
}

function toIso(local: string): string | undefined {
  const ms = new Date(local).getTime();
  return Number.isNaN(ms) ? undefined : new Date(ms).toISOString();
}

/** True when any filter control has a value (used to enable "clear all", R5). */
export function hasActiveFilter(state: Pick<EventFilterState, 'filter'>): boolean {
  const f = state.filter;
  return (
    f.types.length > 0 ||
    f.zoneIds.length > 0 ||
    f.statuses.length > 0 ||
    f.from !== undefined ||
    f.to !== undefined ||
    f.text.trim() !== ''
  );
}
