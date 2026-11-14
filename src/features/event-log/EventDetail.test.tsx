import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/renderWithProviders';
import { createSeedEvents } from '../../mocks/data';
import { EventDetail } from './EventDetail';

const event = createSeedEvents()[3]; // status in_progress

describe('EventDetail', () => {
  it('asks the operator to select an event when none is selected', () => {
    renderWithProviders(
      <EventDetail event={null} saving={false} saveError={null} onStatusChange={vi.fn()} />,
    );
    expect(screen.getByText(/Оберіть подію у журналі/)).toBeInTheDocument();
  });

  it('shows local time and UTC with the offset (N5)', () => {
    renderWithProviders(
      <EventDetail event={event} saving={false} saveError={null} onStatusChange={vi.fn()} />,
    );
    expect(screen.getByText('Виявлено, UTC').nextElementSibling?.textContent).toMatch(/UTC$/);
    expect(screen.getByText('Виявлено, місцевий час').nextElementSibling?.textContent).toMatch(
      /UTC[+-]\d{2}:\d{2}\)$/,
    );
  });

  it('lists the status history newest first with operator id (R6)', () => {
    renderWithProviders(
      <EventDetail event={event} saving={false} saveError={null} onStatusChange={vi.fn()} />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(event.history.length);
    expect(items[0]).toHaveTextContent(
      `Оператор: ${event.history[event.history.length - 1].operatorId}`,
    );
  });

  it('saves the chosen status through the handler (R7)', async () => {
    const user = userEvent.setup();
    const onStatusChange = vi.fn();
    renderWithProviders(
      <EventDetail event={event} saving={false} saveError={null} onStatusChange={onStatusChange} />,
    );
    const save = screen.getByRole('button', { name: 'Зберегти статус' });
    expect(save).toBeDisabled(); // nothing changed yet
    await user.selectOptions(screen.getByLabelText('Новий статус'), 'closed');
    await user.click(save);
    expect(onStatusChange).toHaveBeenCalledWith(event.id, 'closed');
  });

  it('shows the save error and a busy label while saving', () => {
    renderWithProviders(
      <EventDetail event={event} saving saveError="Помилка" onStatusChange={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: 'Збереження…' })).toBeDisabled();
    expect(screen.getByText('Помилка')).toBeInTheDocument();
  });
});
