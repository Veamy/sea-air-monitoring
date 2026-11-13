import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from '@carbon/react';
import type { SystemEvent } from '../../domain/event';
import { formatLocal } from '../../lib/time';
import { UI_SIZE } from '../../theme/theme';
import { TYPE_LABELS } from './labels';
import { PriorityTag, StatusTag } from './StatusTag';

interface EventTableProps {
  /** Events in display order (newest first). */
  events: SystemEvent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const HEADERS = [
  { key: 'time', header: 'Час виявлення' },
  { key: 'id', header: 'ID' },
  { key: 'type', header: 'Тип' },
  { key: 'zone', header: 'Зона' },
  { key: 'source', header: 'Джерело' },
  { key: 'status', header: 'Статус' },
  { key: 'priority', header: 'Пріоритет' },
];

/** Table of events (R1, R2). High-priority rows are marked (R8). */
export function EventTable({ events, selectedId, onSelect }: EventTableProps) {
  return (
    <TableContainer title="Журнал подій" description={`Показано подій: ${events.length}`}>
      <Table size={UI_SIZE} aria-label="Журнал подій">
        <TableHead>
          <TableRow>
            {HEADERS.map((h) => (
              <TableHeader key={h.key} scope="col">
                {h.header}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <TableRow
              key={event.id}
              className={[
                event.priority === 'high' ? 'event-table__row--high' : '',
                event.id === selectedId ? 'event-table__row--selected' : '',
              ].join(' ')}
            >
              <TableCell>
                <time dateTime={event.detectedAt}>{formatLocal(event.detectedAt)}</time>
              </TableCell>
              <TableCell>
                <button
                  type="button"
                  className="event-table__select"
                  aria-current={event.id === selectedId ? 'true' : undefined}
                  onClick={() => onSelect(event.id)}
                >
                  {event.id}
                </button>
              </TableCell>
              <TableCell>{TYPE_LABELS[event.type]}</TableCell>
              <TableCell>{event.zone.name}</TableCell>
              <TableCell>{event.source.name}</TableCell>
              <TableCell>
                <StatusTag status={event.status} />
              </TableCell>
              <TableCell>
                <PriorityTag priority={event.priority} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
