import {
  EMPTY_FILTER,
  applyFilter,
  countUnprocessedHighPriority,
  sortNewestFirst,
  type SystemEvent,
} from './event';

const base = (overrides: Partial<SystemEvent>): SystemEvent => ({
  id: 'E-1',
  type: 'contact',
  priority: 'medium',
  zone: { id: 'z1', name: 'Port approach' },
  source: { id: 's1', name: 'Radar 1' },
  status: 'new',
  detectedAt: '2026-11-17T08:00:00Z',
  description: 'Surface contact',
  history: [],
  ...overrides,
});

const events: SystemEvent[] = [
  base({ id: 'E-1', detectedAt: '2026-11-17T08:00:00Z' }),
  base({
    id: 'E-2',
    type: 'anomaly',
    priority: 'high',
    zone: { id: 'z2', name: 'Roadstead' },
    status: 'in_progress',
    detectedAt: '2026-11-17T09:00:00Z',
    description: 'Course change outside the lane',
  }),
  base({
    id: 'E-3',
    priority: 'high',
    status: 'closed',
    detectedAt: '2026-11-17T07:00:00Z',
  }),
];

describe('applyFilter', () => {
  it('returns all events for an empty filter', () => {
    expect(applyFilter(events, EMPTY_FILTER)).toHaveLength(3);
  });

  it('combines type and zone criteria', () => {
    const result = applyFilter(events, { ...EMPTY_FILTER, types: ['anomaly'], zoneIds: ['z2'] });
    expect(result.map((e) => e.id)).toEqual(['E-2']);
  });

  it('filters by status', () => {
    const result = applyFilter(events, { ...EMPTY_FILTER, statuses: ['new'] });
    expect(result.map((e) => e.id)).toEqual(['E-1']);
  });

  it('filters by time range using UTC bounds', () => {
    const result = applyFilter(events, {
      ...EMPTY_FILTER,
      from: '2026-11-17T07:30:00Z',
      to: '2026-11-17T08:30:00Z',
    });
    expect(result.map((e) => e.id)).toEqual(['E-1']);
  });

  it('matches free text in the description case-insensitively', () => {
    const result = applyFilter(events, { ...EMPTY_FILTER, text: '  COURSE ' });
    expect(result.map((e) => e.id)).toEqual(['E-2']);
  });
});

describe('sortNewestFirst', () => {
  it('orders events by detection time, newest first', () => {
    expect(sortNewestFirst(events).map((e) => e.id)).toEqual(['E-2', 'E-1', 'E-3']);
  });

  it('does not mutate the input array', () => {
    const copy = [...events];
    sortNewestFirst(events);
    expect(events).toEqual(copy);
  });
});

describe('countUnprocessedHighPriority', () => {
  it('counts high-priority events that are not closed', () => {
    expect(countUnprocessedHighPriority(events)).toBe(1);
  });
});
