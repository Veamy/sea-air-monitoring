import { useEffect, useState } from 'react';
import { Button, InlineNotification, Select, SelectItem } from '@carbon/react';
import { EVENT_STATUSES, type EventStatus, type SystemEvent } from '../../domain/event';
import { formatLocal, formatUtc, formatUtcOffset } from '../../lib/time';
import { UI_SIZE } from '../../theme/theme';
import { PRIORITY_LABELS, STATUS_LABELS, TYPE_LABELS } from './labels';
import { PriorityTag, StatusTag } from './StatusTag';

interface EventDetailProps {
  /** Selected event, or null when nothing is selected. */
  event: SystemEvent | null;
  /** True while a status change request is in progress. */
  saving: boolean;
  /** Message of the last failed status change, if any. */
  saveError: string | null;
  onStatusChange: (id: string, status: EventStatus) => void;
}

/** Detail panel: all attributes, times in local time and UTC, and status history (R6, R7, N5). */
export function EventDetail({ event, saving, saveError, onStatusChange }: EventDetailProps) {
  if (!event) {
    return (
      <section className="event-detail" aria-labelledby="event-detail-title">
        <h2 id="event-detail-title" className="event-detail__title">
          Деталі події
        </h2>
        <p>Оберіть подію у журналі, щоб переглянути її деталі та історію статусів.</p>
      </section>
    );
  }
  return <SelectedEventDetail key={event.id} {...{ event, saving, saveError, onStatusChange }} />;
}

interface SelectedProps extends Omit<EventDetailProps, 'event'> {
  event: SystemEvent;
}

function SelectedEventDetail({ event, saving, saveError, onStatusChange }: SelectedProps) {
  // The status control is local until the operator presses the save button.
  const [draft, setDraft] = useState<EventStatus>(event.status);
  useEffect(() => setDraft(event.status), [event.status]);

  const history = [...event.history].reverse();

  return (
    <section className="event-detail" aria-labelledby="event-detail-title">
      <h2 id="event-detail-title" className="event-detail__title">
        Подія {event.id}
      </h2>

      <dl className="event-detail__attributes">
        <dt>Тип</dt>
        <dd>{TYPE_LABELS[event.type]}</dd>
        <dt>Пріоритет</dt>
        <dd>
          <PriorityTag priority={event.priority} /> {PRIORITY_LABELS[event.priority]}
        </dd>
        <dt>Статус</dt>
        <dd>
          <StatusTag status={event.status} />
        </dd>
        <dt>Зона</dt>
        <dd>{event.zone.name}</dd>
        <dt>Джерело</dt>
        <dd>{event.source.name}</dd>
        <dt>Виявлено, місцевий час</dt>
        <dd>
          <time dateTime={event.detectedAt}>
            {formatLocal(event.detectedAt)} ({formatUtcOffset(new Date(event.detectedAt))})
          </time>
        </dd>
        <dt>Виявлено, UTC</dt>
        <dd>
          <time dateTime={event.detectedAt}>{formatUtc(event.detectedAt)}</time>
        </dd>
        <dt>Опис</dt>
        <dd>{event.description}</dd>
      </dl>

      <div className="event-detail__status">
        <Select
          id="event-status"
          size={UI_SIZE}
          labelText="Новий статус"
          value={draft}
          disabled={saving}
          onChange={(e) => setDraft(e.target.value as EventStatus)}
        >
          {EVENT_STATUSES.map((s) => (
            <SelectItem key={s} value={s} text={STATUS_LABELS[s]} />
          ))}
        </Select>
        <Button
          size={UI_SIZE}
          disabled={saving || draft === event.status}
          onClick={() => onStatusChange(event.id, draft)}
        >
          {saving ? 'Збереження…' : 'Зберегти статус'}
        </Button>
      </div>

      {saveError && (
        <InlineNotification
          kind="error"
          title="Статус не збережено"
          subtitle={saveError}
          lowContrast
          hideCloseButton
        />
      )}

      <h3 className="event-detail__subtitle">Історія статусів</h3>
      <ol className="event-detail__history">
        {history.map((change) => (
          <li key={`${change.changedAt}-${change.status}`}>
            <strong>{STATUS_LABELS[change.status]}</strong>
            <span>
              <time dateTime={change.changedAt}>{formatLocal(change.changedAt)}</time>
              {' · '}
              <time dateTime={change.changedAt}>{formatUtc(change.changedAt)}</time>
            </span>
            <span>Оператор: {change.operatorId}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
