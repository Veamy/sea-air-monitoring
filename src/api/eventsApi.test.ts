import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { mockConfig } from '../mocks/config';
import { ApiError, fetchEvents, updateEventStatus } from './eventsApi';

describe('fetchEvents', () => {
  it('returns the seed events', async () => {
    const events = await fetchEvents();
    expect(events.length).toBeGreaterThan(0);
    expect(events[0]).toHaveProperty('zone.name');
  });

  it('returns an empty list when the mock is set to empty', async () => {
    mockConfig.emptyEvents = true;
    await expect(fetchEvents()).resolves.toEqual([]);
  });

  it('throws ApiError with the status when the server fails', async () => {
    mockConfig.failAll = true;
    const error = await fetchEvents().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(500);
  });

  it('throws ApiError without a status on network failure', async () => {
    server.use(http.get('/api/events', () => HttpResponse.error()));
    const error = await fetchEvents().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBeUndefined();
  });
});

describe('updateEventStatus', () => {
  it('changes the status and appends a history record', async () => {
    const updated = await updateEventStatus('EV-1001', 'closed');
    expect(updated.status).toBe('closed');
    expect(updated.history.at(-1)?.status).toBe('closed');
    expect(updated.history.at(-1)?.operatorId).toBe('op-01');
  });

  it('keeps the change visible in later reads', async () => {
    await updateEventStatus('EV-1001', 'in_progress');
    const events = await fetchEvents();
    expect(events.find((e) => e.id === 'EV-1001')?.status).toBe('in_progress');
  });

  it('rejects an unknown event id with 404', async () => {
    const error = await updateEventStatus('EV-missing', 'closed').catch((e: unknown) => e);
    expect((error as ApiError).status).toBe(404);
  });
});
