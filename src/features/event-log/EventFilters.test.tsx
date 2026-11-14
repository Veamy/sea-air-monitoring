import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/renderWithProviders';
import { EventFilters, type FilterValues } from './EventFilters';

const EMPTY: FilterValues = { type: '', zone: '', status: '', from: '', to: '', q: '' };
const ZONES = [{ id: 'zone-port', name: 'Акваторія порту' }];

describe('EventFilters', () => {
  it('reports the chosen type with its URL key (R4)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(
      <EventFilters
        values={EMPTY}
        zones={ZONES}
        canClear={false}
        onChange={onChange}
        onClear={vi.fn()}
      />,
    );
    await user.selectOptions(screen.getByLabelText('Тип'), 'anomaly');
    expect(onChange).toHaveBeenCalledWith('type', 'anomaly');
  });

  it('reports free-text input (R4)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(
      <EventFilters
        values={EMPTY}
        zones={ZONES}
        canClear={false}
        onChange={onChange}
        onClear={vi.fn()}
      />,
    );
    await user.type(screen.getByRole('searchbox', { name: 'Пошук за текстом або ID' }), 'E');
    expect(onChange).toHaveBeenCalledWith('q', 'E');
  });

  it('disables "clear all" when no filter is set and enables it otherwise (R5)', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    const { unmount } = renderWithProviders(
      <EventFilters
        values={EMPTY}
        zones={ZONES}
        canClear={false}
        onChange={vi.fn()}
        onClear={onClear}
      />,
    );
    expect(screen.getByRole('button', { name: 'Скинути всі фільтри' })).toBeDisabled();
    unmount();

    renderWithProviders(
      <EventFilters values={EMPTY} zones={ZONES} canClear onChange={vi.fn()} onClear={onClear} />,
    );
    await user.click(screen.getByRole('button', { name: 'Скинути всі фільтри' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
