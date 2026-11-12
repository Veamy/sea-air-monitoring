import { QueryClient } from '@tanstack/react-query';

/**
 * Server-state cache settings. One retry hides short network glitches; a failure that
 * persists is shown in the error state with a retry action (R9).
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}
