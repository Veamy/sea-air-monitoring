import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Async states/EmptyState',
  component: EmptyState,
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const NoEvents: Story = {
  args: {
    title: 'Подій немає',
    description: 'За поточну зміну система не зафіксувала жодної події.',
  },
};

export const NoMatches: Story = {
  args: {
    title: 'Нічого не знайдено',
    description:
      'Жодна подія не відповідає поточним фільтрам. Скиньте фільтри, щоб побачити весь журнал.',
  },
};
