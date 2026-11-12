import type { Meta, StoryObj } from '@storybook/react';
import { AppShell } from './AppShell';

const meta: Meta<typeof AppShell> = {
  title: 'Shell/AppShell',
  component: AppShell,
  args: {
    unprocessedHighPriority: 0,
    children: <p>Вміст сторінки</p>,
  },
};

export default meta;

type Story = StoryObj<typeof AppShell>;

export const CountUnknown: Story = {
  args: { unprocessedHighPriority: null },
};

export const NoUnprocessed: Story = {};

export const WithUnprocessed: Story = {
  args: { unprocessedHighPriority: 3 },
};
