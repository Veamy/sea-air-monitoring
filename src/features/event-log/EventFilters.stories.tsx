import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { createSeedEvents } from '../../mocks/data';
import { EventFilters, type FilterValues } from './EventFilters';

const zones = [...new Map(createSeedEvents().map((e) => [e.zone.id, e.zone])).values()];

const EMPTY_VALUES: FilterValues = { type: '', zone: '', status: '', from: '', to: '', q: '' };

const meta: Meta<typeof EventFilters> = {
  title: 'Event log/EventFilters',
  component: EventFilters,
  args: {
    values: EMPTY_VALUES,
    zones,
    canClear: false,
    onChange: fn(),
    onClear: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof EventFilters>;

export const NoFilters: Story = {};

export const FiltersApplied: Story = {
  args: {
    values: { ...EMPTY_VALUES, type: 'anomaly', status: 'new', q: 'курс' },
    canClear: true,
  },
};
