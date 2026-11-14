import { describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/renderWithProviders';
import { createSeedEvents } from '../../mocks/data';
import { EventTable } from './EventTable';

const events = createSeedEvents().reverse();

describe('EventTable', () => {
  it('renders one row per event with the required columns (R1)', () => {
    renderWithProviders(<EventTable events={events} selectedId={null} onSelect={vi.fn()} />);
    const rows = within(screen.getByRole('table')).getAllByRole('row');
    // header row + one row per event
    expect(rows).toHaveLength(events.length + 1);
    const headers = within(rows[0])
      .getAllByRole('columnheader')
      .map((h) => h.textContent);
    expect(headers).toEqual([
      'Час виявлення',
      'ID',
      'Тип',
      'Зона',
      'Джерело',
      'Статус',
      'Пріоритет',
    ]);
  });

  it('calls onSelect with the event id when its id button is pressed', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderWithProviders(<EventTable events={events} selectedId={null} onSelect={onSelect} />);
    await user.click(screen.getByRole('button', { name: events[1].id }));
    expect(onSelect).toHaveBeenCalledWith(events[1].id);
  });

  it('marks the selected event as current', () => {
    renderWithProviders(
      <EventTable events={events} selectedId={events[0].id} onSelect={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: events[0].id })).toHaveAttribute(
      'aria-current',
      'true',
    );
    expect(screen.getByRole('button', { name: events[1].id })).not.toHaveAttribute('aria-current');
  });

  it('shows the priority label of high-priority events (R8)', () => {
    const high = events.filter((e) => e.priority === 'high');
    expect(high.length).toBeGreaterThan(0);
    renderWithProviders(<EventTable events={high} selectedId={null} onSelect={vi.fn()} />);
    expect(screen.getAllByText('Високий').length).toBe(high.length);
  });
});
