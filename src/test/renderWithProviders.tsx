import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { Theme } from '@carbon/react';
import { UI_THEME } from '../theme/theme';
import { ROUTER_FUTURE } from '../routerFuture';

/** Renders UI inside the same providers as the app, with retries off so errors show at once. */
export function renderWithProviders(ui: ReactElement, initialEntry = '/') {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[initialEntry]} future={ROUTER_FUTURE}>
        <Theme theme={UI_THEME}>{ui}</Theme>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}
