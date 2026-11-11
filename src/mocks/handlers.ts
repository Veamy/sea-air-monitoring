import { http, HttpResponse, delay } from 'msw';
import { EVENT_STATUSES, type EventStatus, type SystemEvent } from '../domain/event';
import { mockConfig } from './config';
import { createSeedEvents, MOCK_OPERATOR_ID } from './data';

/** In-memory store. Reset by creating new handlers (see createHandlers). */
export function createHandlers(initial: SystemEvent[] = createSeedEvents()) {
  let events = initial.map((e) => ({ ...e, history: [...e.history] }));

  const failIfNeeded = () =>
    mockConfig.failAll
      ? HttpResponse.json({ message: 'Mock server failure' }, { status: 500 })
      : null;

  return [
    http.get('/api/events', async () => {
      await delay(mockConfig.latencyMs);
      const failure = failIfNeeded();
      if (failure) return failure;
      return HttpResponse.json(mockConfig.emptyEvents ? [] : events);
    }),

    http.patch('/api/events/:id/status', async ({ params, request }) => {
      await delay(mockConfig.latencyMs);
      const failure = failIfNeeded();
      if (failure) return failure;

      const body = (await request.json()) as { status?: string };
      if (!EVENT_STATUSES.includes(body.status as EventStatus)) {
        return HttpResponse.json({ message: 'Unknown status' }, { status: 400 });
      }
      const target = events.find((e) => e.id === params.id);
      if (!target) {
        return HttpResponse.json({ message: 'Event not found' }, { status: 404 });
      }

      const status = body.status as EventStatus;
      const updated: SystemEvent = {
        ...target,
        status,
        history: [
          ...target.history,
          { status, changedAt: new Date().toISOString(), operatorId: MOCK_OPERATOR_ID },
        ],
      };
      events = events.map((e) => (e.id === updated.id ? updated : e));
      return HttpResponse.json(updated);
    }),
  ];
}
