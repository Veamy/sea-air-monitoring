/** Information objects of the event log (requirements R1, R2, R7, R8). */

export const EVENT_TYPES = ['contact', 'crossing', 'anomaly', 'lost_contact', 'other'] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const EVENT_STATUSES = ['new', 'in_progress', 'closed'] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

export const PRIORITIES = ['high', 'medium', 'low'] as const;
export type Priority = (typeof PRIORITIES)[number];

export interface Zone {
  id: string;
  name: string;
}

export interface Source {
  id: string;
  name: string;
}

export interface StatusChange {
  status: EventStatus;
  /** ISO 8601 time in UTC. */
  changedAt: string;
  operatorId: string;
}

export interface SystemEvent {
  id: string;
  type: EventType;
  priority: Priority;
  zone: Zone;
  source: Source;
  status: EventStatus;
  /** ISO 8601 time in UTC when the event was detected. */
  detectedAt: string;
  description: string;
  history: StatusChange[];
}

export interface EventFilter {
  types: EventType[];
  zoneIds: string[];
  statuses: EventStatus[];
  /** ISO 8601 UTC bounds, both optional. */
  from?: string;
  to?: string;
  text: string;
}

export const EMPTY_FILTER: EventFilter = {
  types: [],
  zoneIds: [],
  statuses: [],
  text: '',
};

const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

/** Filters events by all active criteria (R4). Empty criteria match everything. */
export function applyFilter(events: SystemEvent[], filter: EventFilter): SystemEvent[] {
  const text = filter.text.trim().toLowerCase();
  const fromMs = filter.from ? Date.parse(filter.from) : undefined;
  const toMs = filter.to ? Date.parse(filter.to) : undefined;

  return events.filter((event) => {
    if (filter.types.length && !filter.types.includes(event.type)) return false;
    if (filter.zoneIds.length && !filter.zoneIds.includes(event.zone.id)) return false;
    if (filter.statuses.length && !filter.statuses.includes(event.status)) return false;
    const detectedMs = Date.parse(event.detectedAt);
    if (fromMs !== undefined && detectedMs < fromMs) return false;
    if (toMs !== undefined && detectedMs > toMs) return false;
    if (
      text &&
      !event.description.toLowerCase().includes(text) &&
      !event.id.toLowerCase().includes(text)
    ) {
      return false;
    }
    return true;
  });
}

/** Newest first (R2). Ties are broken by priority. */
export function sortNewestFirst(events: SystemEvent[]): SystemEvent[] {
  return [...events].sort((a, b) => {
    const byTime = Date.parse(b.detectedAt) - Date.parse(a.detectedAt);
    return byTime !== 0 ? byTime : PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  });
}

/** Counts events that still need attention: high priority and not closed (R8). */
export function countUnprocessedHighPriority(events: SystemEvent[]): number {
  return events.filter((e) => e.priority === 'high' && e.status !== 'closed').length;
}
