import type { Meta, StoryObj } from '@storybook/react';
import { EVENT_STATUSES, PRIORITIES } from '../../domain/event';
import { PriorityTag, StatusTag } from './StatusTag';

const meta: Meta<typeof StatusTag> = {
  title: 'Event log/StatusTag',
  component: StatusTag,
  args: { status: 'new' },
};

export default meta;

type Story = StoryObj<typeof StatusTag>;

export const New: Story = { args: { status: EVENT_STATUSES[0] } };

export const InProgress: Story = { args: { status: EVENT_STATUSES[1] } };

export const Closed: Story = { args: { status: EVENT_STATUSES[2] } };

/** Priority tags are shown in the same file for the same catalog entry. */
export const HighPriority: Story = {
  render: () => <PriorityTag priority={PRIORITIES[0]} />,
};

export const MediumPriority: Story = {
  render: () => <PriorityTag priority={PRIORITIES[1]} />,
};

export const LowPriority: Story = {
  render: () => <PriorityTag priority={PRIORITIES[2]} />,
};
