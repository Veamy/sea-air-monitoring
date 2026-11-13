import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { createSeedEvents } from '../../mocks/data';
import { EventDetail } from './EventDetail';

const events = createSeedEvents();
const closed = events.find((e) => e.status === 'closed') ?? events[0];

const meta: Meta<typeof EventDetail> = {
  title: 'Event log/EventDetail',
  component: EventDetail,
  args: {
    event: closed,
    saving: false,
    saveError: null,
    onStatusChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof EventDetail>;

export const NoSelection: Story = {
  args: { event: null },
};

export const Selected: Story = {};

export const Saving: Story = {
  args: { saving: true },
};

export const SaveFailed: Story = {
  args: { saveError: 'Сервер відхилив зміну статусу. Спробуйте ще раз.' },
};
