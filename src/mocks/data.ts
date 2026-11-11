import type { EventStatus, EventType, Priority, SystemEvent } from '../domain/event';

/** Fixed base time keeps the fake data stable between runs and in tests. */
const BASE_TIME = Date.parse('2026-11-17T08:00:00Z');

const ZONES = [
  { id: 'zone-port', name: 'Port water area' },
  { id: 'zone-approach', name: 'Port approaches' },
  { id: 'zone-coast', name: 'Coastal strip' },
  { id: 'zone-air', name: 'Airspace above the approaches' },
];

const SOURCES = [
  { id: 'src-radar-1', name: 'Coastal radar RL-1' },
  { id: 'src-radar-2', name: 'Coastal radar RL-2' },
  { id: 'src-post-7', name: 'Observation post 7' },
];

const TYPES: EventType[] = ['contact', 'crossing', 'anomaly', 'lost_contact', 'other'];
const PRIORITIES: Priority[] = ['high', 'medium', 'low'];
const STATUSES: EventStatus[] = ['new', 'in_progress', 'closed'];

const DESCRIPTIONS: Record<EventType, string> = {
  contact: 'New surface contact detected',
  crossing: 'Object crossed the zone boundary',
  anomaly: 'Course change outside the designated lane',
  lost_contact: 'Contact lost for more than five minutes',
  other: 'Unclassified observation',
};

function buildEvent(index: number): SystemEvent {
  const type = TYPES[index % TYPES.length];
  const priority = PRIORITIES[(index * 7) % PRIORITIES.length];
  const status = STATUSES[index % STATUSES.length];
  const zone = ZONES[index % ZONES.length];
  const source = SOURCES[index % SOURCES.length];
  const detectedAt = new Date(BASE_TIME + index * 9 * 60_000).toISOString();

  const history: SystemEvent['history'] = [
    { status: 'new', changedAt: detectedAt, operatorId: 'system' },
  ];
  if (status !== 'new') {
    history.push({
      status: 'in_progress',
      changedAt: new Date(BASE_TIME + (index * 9 + 3) * 60_000).toISOString(),
      operatorId: 'op-01',
    });
  }
  if (status === 'closed') {
    history.push({
      status: 'closed',
      changedAt: new Date(BASE_TIME + (index * 9 + 6) * 60_000).toISOString(),
      operatorId: 'op-01',
    });
  }

  return {
    id: `EV-${String(1001 + index)}`,
    type,
    priority,
    zone,
    source,
    status,
    detectedAt,
    description: DESCRIPTIONS[type],
    history,
  };
}

/** Builds a fresh copy of the seed events, so each test starts from the same state. */
export function createSeedEvents(count = 14): SystemEvent[] {
  return Array.from({ length: count }, (_, i) => buildEvent(i));
}

export const MOCK_OPERATOR_ID = 'op-01';
