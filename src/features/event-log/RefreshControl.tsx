import { Select, SelectItem } from '@carbon/react';
import { UI_SIZE } from '../../theme/theme';
import { REFRESH_OPTIONS } from './refreshOptions';

interface RefreshControlProps {
  intervalMs: number;
  onChange: (intervalMs: number) => void;
}

/** Selects how often the event list is reloaded from the server (R3). */
export function RefreshControl({ intervalMs, onChange }: RefreshControlProps) {
  return (
    <Select
      id="refresh-interval"
      size={UI_SIZE}
      labelText="Автоматичне оновлення"
      value={String(intervalMs)}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      {REFRESH_OPTIONS.map((o) => (
        <SelectItem key={o.value} value={String(o.value)} text={o.text} />
      ))}
    </Select>
  );
}
