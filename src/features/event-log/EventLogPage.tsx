import { useMemo, useState } from 'react';
import { applyFilter, sortNewestFirst, type EventStatus, type Zone } from '../../domain/event';
import { ApiError } from '../../api/eventsApi';
import { useEventsQuery, useUpdateEventStatus } from '../../hooks/useEvents';
import { EventLogView } from './EventLogView';
import { hasActiveFilter, useEventFilter } from './useEventFilter';
import { DEFAULT_REFRESH_MS } from './refreshOptions';

/** Zones that occur in the loaded events, sorted by name. */
function uniqueZones(events: { zone: Zone }[]): Zone[] {
  const byId = new Map<string, Zone>();
  for (const e of events) byId.set(e.zone.id, e.zone);
  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name, 'uk'));
}

function errorText(error: unknown): string | null {
  if (!error) return null;
  if (error instanceof ApiError && error.status === 404) return 'Подію не знайдено.';
  return 'Не вдалося зберегти статус. Перевірте з’єднання і спробуйте ще раз.';
}

/** Container for the event log: connects server data, URL state and mutations. */
export function EventLogPage() {
  const [refreshIntervalMs, setRefreshIntervalMs] = useState(DEFAULT_REFRESH_MS);
  const query = useEventsQuery(refreshIntervalMs || false);
  const statusMutation = useUpdateEventStatus();
  const filterState = useEventFilter();

  const events = useMemo(() => query.data ?? [], [query.data]);
  const visibleEvents = useMemo(
    () => sortNewestFirst(applyFilter(events, filterState.filter)),
    [events, filterState.filter],
  );
  const zones = useMemo(() => uniqueZones(events), [events]);
  const selectedEvent = events.find((e) => e.id === filterState.selectedId) ?? null;

  // A failed refresh with cached data keeps the table; the error state is only for "no data".
  const viewStatus = query.isError && !query.data ? 'error' : query.isPending ? 'loading' : 'ready';

  const handleStatusChange = (id: string, next: EventStatus) =>
    statusMutation.mutate({ id, status: next });

  return (
    <EventLogView
      status={viewStatus}
      events={events}
      visibleEvents={visibleEvents}
      filterValues={{
        type: filterState.type,
        zone: filterState.zoneId,
        status: filterState.status,
        from: filterState.fromLocal,
        to: filterState.toLocal,
        q: filterState.text,
      }}
      zones={zones}
      canClearFilters={hasActiveFilter(filterState)}
      onFilterChange={filterState.setFilterField}
      onClearFilters={filterState.clearFilters}
      selectedEvent={selectedEvent}
      onSelect={filterState.select}
      onRetry={() => void query.refetch()}
      refreshIntervalMs={refreshIntervalMs}
      onRefreshIntervalChange={setRefreshIntervalMs}
      refreshFailed={query.isError && !!query.data}
      statusSaving={statusMutation.isPending}
      statusError={errorText(statusMutation.error)}
      onStatusChange={handleStatusChange}
    />
  );
}
