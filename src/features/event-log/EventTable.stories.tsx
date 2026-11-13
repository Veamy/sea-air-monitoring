import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { createSeedEvents } from '../../mocks/data';
import { EventTable } from './EventTable';

const events = createSeedEvents().reverse();

const meta: Meta<typeof EventTable> = {
  title: 'Event log/EventTable',
  component: EventTable,
  args: { events, selectedId: null, onSelect: fn() },
};

export default meta;

type Story = StoryObj<typeof EventTable>;

export const Data: Story = {};

export const WithSelection: Story = {
  args: { selectedId: events[2].id },
};
