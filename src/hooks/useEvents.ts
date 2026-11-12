import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchEvents, updateEventStatus } from '../api/eventsApi';
import type { EventStatus } from '../domain/event';

/** Query keys of the event list; the list is shared by the header counter and the log. */
export const EVENTS_QUERY_KEY = ['events'] as const;

/**
 * Loads the event list (R1, R2). Pass a refresh interval in milliseconds to poll the
 * server (R3); `false` disables polling.
 */
export function useEventsQuery(refetchIntervalMs: number | false = false) {
  return useQuery({
    queryKey: EVENTS_QUERY_KEY,
    queryFn: fetchEvents,
    refetchInterval: refetchIntervalMs,
  });
}

/** Changes the status of one event (R7) and refreshes the cached list. */
export function useUpdateEventStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: EventStatus }) =>
      updateEventStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY }),
  });
}
