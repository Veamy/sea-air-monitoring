import type { EventStatus, SystemEvent } from '../domain/event';

/** Error raised for any failed request; carries the HTTP status when there is one. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(input, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
  } catch {
    throw new ApiError('Network error');
  }
  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status);
  }
  return (await response.json()) as T;
}

export function fetchEvents(): Promise<SystemEvent[]> {
  return request<SystemEvent[]>('/api/events');
}

export function updateEventStatus(id: string, status: EventStatus): Promise<SystemEvent> {
  return request<SystemEvent>(`/api/events/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
