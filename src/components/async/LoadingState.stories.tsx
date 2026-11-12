import type { Meta, StoryObj } from '@storybook/react';
import { LoadingState } from './LoadingState';

const meta: Meta<typeof LoadingState> = {
  title: 'Async states/LoadingState',
  component: LoadingState,
};

export default meta;

type Story = StoryObj<typeof LoadingState>;

export const Default: Story = {};
