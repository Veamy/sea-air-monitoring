import type { Preview } from '@storybook/react';
import { Theme } from '@carbon/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import '@carbon/styles/css/styles.css';
import { createQueryClient } from '../src/api/queryClient';
import { UI_THEME } from '../src/theme/theme';

const preview: Preview = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={createQueryClient()}>
        <MemoryRouter>
          <Theme theme={UI_THEME}>
            <div style={{ background: 'var(--cds-background)', minHeight: '100vh' }}>
              <Story />
            </div>
          </Theme>
        </MemoryRouter>
      </QueryClientProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'fullscreen',
  },
};

export default preview;
