import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { RefreshControl } from './RefreshControl';
import { DEFAULT_REFRESH_MS } from './refreshOptions';

const meta: Meta<typeof RefreshControl> = {
  title: 'Event log/RefreshControl',
  component: RefreshControl,
  args: { intervalMs: DEFAULT_REFRESH_MS, onChange: fn() },
};

export default meta;

type Story = StoryObj<typeof RefreshControl>;

export const Default: Story = {};

export const Off: Story = {
  args: { intervalMs: 0 },
};
