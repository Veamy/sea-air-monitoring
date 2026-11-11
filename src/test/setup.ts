import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
import { resetMockConfig } from '../mocks/config';
import { createHandlers } from '../mocks/handlers';
import { server } from '../mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

beforeEach(() => {
  // Fresh in-memory store and zero latency for every test.
  server.resetHandlers(...createHandlers());
  resetMockConfig();
});

afterEach(() => {
  resetMockConfig();
});

afterAll(() => server.close());
