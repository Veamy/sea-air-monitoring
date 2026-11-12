import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ErrorState } from './ErrorState';

const meta: Meta<typeof ErrorState> = {
  title: 'Async states/ErrorState',
  component: ErrorState,
  args: { onRetry: fn() },
};

export default meta;

type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {};

export const CustomMessage: Story = {
  args: { message: 'Сервер не відповів протягом 10 секунд.' },
};
