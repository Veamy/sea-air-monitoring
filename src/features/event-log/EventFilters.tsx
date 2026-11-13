import { Button, Search, Select, SelectItem, TextInput } from '@carbon/react';
import { Renew } from '@carbon/icons-react';
import { EVENT_STATUSES, EVENT_TYPES, type Zone } from '../../domain/event';
import { UI_SIZE } from '../../theme/theme';
import { STATUS_LABELS, TYPE_LABELS } from './labels';

/** URL keys of the filter fields (see useEventFilter). */
export type FilterField = 'type' | 'zone' | 'status' | 'from' | 'to' | 'q';

export interface FilterValues {
  type: string;
  zone: string;
  status: string;
  /** Local date-time, as produced by `<input type="datetime-local">`. */
  from: string;
  to: string;
  q: string;
}

interface EventFiltersProps {
  values: FilterValues;
  /** Zones offered in the zone select, taken from the loaded events. */
  zones: Zone[];
  /** Whether any filter is set; "clear all" is disabled otherwise. */
  canClear: boolean;
  onChange: (field: FilterField, value: string) => void;
  onClear: () => void;
}

/** Filter panel (R4, R5). All criteria combine. */
export function EventFilters({ values, zones, canClear, onChange, onClear }: EventFiltersProps) {
  return (
    <form
      className="event-filters"
      aria-label="Фільтри подій"
      role="search"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="event-filters__grid">
        <Search
          id="filter-text"
          size={UI_SIZE}
          labelText="Пошук за текстом або ID"
          placeholder="Наприклад, EV-1004 або перетин"
          value={values.q}
          onChange={(e) => onChange('q', e.target.value)}
          onClear={() => onChange('q', '')}
        />
        <Select
          id="filter-type"
          size={UI_SIZE}
          labelText="Тип"
          value={values.type}
          onChange={(e) => onChange('type', e.target.value)}
        >
          <SelectItem value="" text="Усі типи" />
          {EVENT_TYPES.map((t) => (
            <SelectItem key={t} value={t} text={TYPE_LABELS[t]} />
          ))}
        </Select>
        <Select
          id="filter-zone"
          size={UI_SIZE}
          labelText="Зона"
          value={values.zone}
          onChange={(e) => onChange('zone', e.target.value)}
        >
          <SelectItem value="" text="Усі зони" />
          {zones.map((z) => (
            <SelectItem key={z.id} value={z.id} text={z.name} />
          ))}
        </Select>
        <Select
          id="filter-status"
          size={UI_SIZE}
          labelText="Статус"
          value={values.status}
          onChange={(e) => onChange('status', e.target.value)}
        >
          <SelectItem value="" text="Усі статуси" />
          {EVENT_STATUSES.map((s) => (
            <SelectItem key={s} value={s} text={STATUS_LABELS[s]} />
          ))}
        </Select>
        <TextInput
          id="filter-from"
          type="datetime-local"
          size={UI_SIZE}
          labelText="Від (місцевий час)"
          value={values.from}
          onChange={(e) => onChange('from', e.target.value)}
        />
        <TextInput
          id="filter-to"
          type="datetime-local"
          size={UI_SIZE}
          labelText="До (місцевий час)"
          value={values.to}
          onChange={(e) => onChange('to', e.target.value)}
        />
      </div>
      <div className="event-filters__actions">
        <Button
          kind="ghost"
          size={UI_SIZE}
          renderIcon={Renew}
          onClick={onClear}
          disabled={!canClear}
        >
          Скинути всі фільтри
        </Button>
      </div>
    </form>
  );
}
