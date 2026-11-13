import { Button, InlineNotification } from '@carbon/react';
import { EmptyState } from '../../components/async/EmptyState';
import { ErrorState } from '../../components/async/ErrorState';
import { LoadingState } from '../../components/async/LoadingState';
import type { EventStatus, SystemEvent, Zone } from '../../domain/event';
import { EventDetail } from './EventDetail';
import { EventFilters, type FilterField, type FilterValues } from './EventFilters';
import { EventTable } from './EventTable';
import { RefreshControl } from './RefreshControl';

export interface EventLogViewProps {
  /** Load state of the event list. `ready` covers both data and empty data. */
  status: 'loading' | 'error' | 'ready';
  /** All loaded events; used for the zone list and to tell "no events" from "no matches". */
  events: SystemEvent[];
  /** Events after filters, newest first. */
  visibleEvents: SystemEvent[];
  filterValues: FilterValues;
  zones: Zone[];
  canClearFilters: boolean;
  onFilterChange: (field: FilterField, value: string) => void;
  onClearFilters: () => void;
  selectedEvent: SystemEvent | null;
  onSelect: (id: string | null) => void;
  onRetry: () => void;
  refreshIntervalMs: number;
  onRefreshIntervalChange: (intervalMs: number) => void;
  /** The list could not be refreshed, but the previous data is still shown. */
  refreshFailed: boolean;
  statusSaving: boolean;
  statusError: string | null;
  onStatusChange: (id: string, status: EventStatus) => void;
}

/**
 * The event log view (R1–R9). It has four states: loading, error with retry,
 * empty data with an explanation, and data. Presentational: all data comes in as props.
 */
export function EventLogView(props: EventLogViewProps) {
  const {
    status,
    events,
    visibleEvents,
    filterValues,
    zones,
    canClearFilters,
    onFilterChange,
    onClearFilters,
    selectedEvent,
    onSelect,
    onRetry,
    refreshIntervalMs,
    onRefreshIntervalChange,
    refreshFailed,
    statusSaving,
    statusError,
    onStatusChange,
  } = props;

  return (
    <div className="event-log">
      <div className="event-log__toolbar">
        <EventFilters
          values={filterValues}
          zones={zones}
          canClear={canClearFilters}
          onChange={onFilterChange}
          onClear={onClearFilters}
        />
        <RefreshControl intervalMs={refreshIntervalMs} onChange={onRefreshIntervalChange} />
      </div>

      {status === 'loading' && <LoadingState description="Завантаження журналу подій…" />}

      {status === 'error' && <ErrorState onRetry={onRetry} />}

      {status === 'ready' && (
        <>
          {refreshFailed && (
            <InlineNotification
              kind="warning"
              title="Оновлення не вдалося"
              subtitle="Показано останні отримані дані. Журнал буде оновлено за наступним циклом."
              lowContrast
              hideCloseButton
            />
          )}
          <div className="event-log__body">
            <div className="event-log__main">
              {events.length === 0 && (
                <EmptyState
                  title="Подій немає"
                  description="За цю зміну система не зафіксувала жодної події. Журнал оновлюється автоматично."
                />
              )}
              {events.length > 0 && visibleEvents.length === 0 && (
                <EmptyState
                  title="Нічого не знайдено"
                  description="Жодна подія не відповідає поточним фільтрам. Скиньте фільтри, щоб побачити весь журнал."
                  action={
                    <Button kind="tertiary" size="sm" onClick={onClearFilters}>
                      Скинути всі фільтри
                    </Button>
                  }
                />
              )}
              {visibleEvents.length > 0 && (
                <EventTable
                  events={visibleEvents}
                  selectedId={selectedEvent?.id ?? null}
                  onSelect={onSelect}
                />
              )}
            </div>
            <div className="event-log__side">
              <EventDetail
                event={selectedEvent}
                saving={statusSaving}
                saveError={statusError}
                onStatusChange={onStatusChange}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
