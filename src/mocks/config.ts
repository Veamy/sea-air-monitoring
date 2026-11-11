/**
 * Runtime switches for the mock API: latency and error injection, so every view
 * can be shown in its loading, error and empty states (see docs/requirements.md).
 */
export interface MockConfig {
  /** Delay added to every response, in milliseconds. */
  latencyMs: number;
  /** When true, every request fails with HTTP 500. */
  failAll: boolean;
  /** When true, the events list is returned empty. */
  emptyEvents: boolean;
}

export const DEFAULT_MOCK_CONFIG: MockConfig = {
  latencyMs: 400,
  failAll: false,
  emptyEvents: false,
};

export const mockConfig: MockConfig = { ...DEFAULT_MOCK_CONFIG };

export function resetMockConfig(): void {
  Object.assign(mockConfig, DEFAULT_MOCK_CONFIG);
}
