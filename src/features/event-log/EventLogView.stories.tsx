import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { applyFilter, EMPTY_FILTER, sortNewestFirst, type Zone } from '../../domain/event';
import { createSeedEvents } from '../../mocks/data';
import { EventLogView, type EventLogViewProps } from './EventLogView';
import { DEFAULT_REFRESH_MS } from './refreshOptions';

const events = createSeedEvents();
const sorted = sortNewestFirst(events);
const zones: Zone[] = [...new Map(events.map((e) => [e.zone.id, e.zone])).values()];

const NO_FILTERS = { type: '', zone: '', status: '', from: '', to: '', q: '' };

const baseArgs: EventLogViewProps = {
  status: 'ready',
  events: sorted,
  visibleEvents: sorted,
  filterValues: NO_FILTERS,
  zones,
  canClearFilters: false,
  onFilterChange: fn(),
  onClearFilters: fn(),
  selectedEvent: null,
  onSelect: fn(),
  onRetry: fn(),
  refreshIntervalMs: DEFAULT_REFRESH_MS,
  onRefreshIntervalChange: fn(),
  refreshFailed: false,
  statusSaving: false,
  statusError: null,
  onStatusChange: fn(),
};

const meta: Meta<typeof EventLogView> = {
  title: 'Views/EventLogView',
  component: EventLogView,
  args: baseArgs,
};

export default meta;

type Story = StoryObj<typeof EventLogView>;

/** R9: loading state while the first list request is pending. */
export const Loading: Story = {
  args: { status: 'loading', events: [], visibleEvents: [] },
};

/** R9: error state with a retry action. */
export const Failed: Story = {
  args: { status: 'error', events: [], visibleEvents: [] },
};

/** R9: no events at all in the shift. */
export const EmptyNoEvents: Story = {
  args: { events: [], visibleEvents: [] },
};

/** R9: events exist, but no event matches the filters. */
export const EmptyNoMatches: Story = {
  args: {
    visibleEvents: applyFilter(sorted, {
      ...EMPTY_FILTER,
      types: ['lost_contact'],
      zoneIds: ['no-such-zone'],
    }),
    filterValues: { ...NO_FILTERS, zone: 'no-such-zone', type: 'lost_contact' },
    canClearFilters: true,
  },
};

/** Data state with the newest events first and no selection. */
export const Data: Story = {};

/** Data state with a selected event and its detail panel. */
export const DataWithSelection: Story = {
  args: { selectedEvent: sorted[0], onSelect: fn() },
};

/** Data is shown although the last automatic refresh failed. */
export const DataRefreshFailed: Story = {
  args: { refreshFailed: true, selectedEvent: sorted[1] },
};
