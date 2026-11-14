import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../../App';
import { renderWithProviders } from '../../test/renderWithProviders';
import { mockConfig } from '../../mocks/config';
import { createSeedEvents } from '../../mocks/data';
import { countUnprocessedHighPriority } from '../../domain/event';
import { EventLogPage } from './EventLogPage';

const seed = createSeedEvents();

function tableRows() {
  return within(screen.getByRole('table', { name: 'Журнал подій' })).queryAllByRole('row');
}

describe('EventLogPage states (R9)', () => {
  it('shows the loading state while the first request is pending', async () => {
    mockConfig.latencyMs = 300;
    renderWithProviders(<EventLogPage />);
    expect(screen.getByText('Завантаження журналу подій…')).toBeInTheDocument();
    expect(await screen.findByRole('table', { name: 'Журнал подій' })).toBeInTheDocument();
  });

  it('shows the error state and recovers after a retry', async () => {
    const user = userEvent.setup();
    mockConfig.failAll = true;
    renderWithProviders(<EventLogPage />);
    expect(await screen.findByText('Помилка завантаження')).toBeInTheDocument();

    mockConfig.failAll = false;
    await user.click(screen.getByRole('button', { name: 'Повторити' }));
    expect(await screen.findByRole('table', { name: 'Журнал подій' })).toBeInTheDocument();
  });

  it('explains an empty shift when the server has no events', async () => {
    mockConfig.emptyEvents = true;
    renderWithProviders(<EventLogPage />);
    expect(await screen.findByText('Подій немає')).toBeInTheDocument();
    expect(screen.queryByRole('table', { name: 'Журнал подій' })).not.toBeInTheDocument();
  });

  it('explains when no event matches the filters and clears them from there', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EventLogPage />, '/?q=no-such-text-anywhere');
    expect(await screen.findByText('Нічого не знайдено')).toBeInTheDocument();

    const empty = screen.getByRole('region', { name: 'Нічого не знайдено' });
    await user.click(within(empty).getByRole('button', { name: 'Скинути всі фільтри' }));
    expect(await screen.findByRole('table', { name: 'Журнал подій' })).toBeInTheDocument();
  });

  it('shows data newest first (R2)', async () => {
    renderWithProviders(<EventLogPage />);
    await screen.findByRole('table', { name: 'Журнал подій' });
    const firstId = within(tableRows()[1]).getByRole('button').textContent;
    expect(firstId).toBe(seed[seed.length - 1].id);
  });
});

describe('main scenario: filter, select, change status', () => {
  it('filters by type, opens an event, closes it and updates the header counter', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    await screen.findByRole('table', { name: 'Журнал подій' });
    const highBefore = countUnprocessedHighPriority(seed);
    await waitFor(() =>
      expect(
        screen.getByText(`Необроблені високого пріоритету: ${highBefore}`),
      ).toBeInTheDocument(),
    );

    // 1. filter by type
    await user.selectOptions(screen.getByLabelText('Тип'), 'anomaly');
    const anomalies = seed.filter((e) => e.type === 'anomaly');
    expect(tableRows()).toHaveLength(anomalies.length + 1);

    // 2. select the newest anomaly
    const target = anomalies.sort((a, b) => b.detectedAt.localeCompare(a.detectedAt))[0];
    await user.click(screen.getByRole('button', { name: target.id }));
    expect(screen.getByRole('heading', { name: `Подія ${target.id}` })).toBeInTheDocument();

    // 3. close it; the filter and the selection stay
    await user.selectOptions(screen.getByLabelText('Новий статус'), 'closed');
    await user.click(screen.getByRole('button', { name: 'Зберегти статус' }));

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Зберегти статус' })).toBeDisabled(),
    );
    expect(screen.getByLabelText('Тип')).toHaveValue('anomaly');
    expect(screen.getByRole('heading', { name: `Подія ${target.id}` })).toBeInTheDocument();
    expect(screen.getAllByText('Закрита').length).toBeGreaterThan(0);

    // 4. the counter reflects the closed event (R8)
    const expectedAfter = countUnprocessedHighPriority(
      seed.map((e) => (e.id === target.id ? { ...e, status: 'closed' as const } : e)),
    );
    await waitFor(() =>
      expect(
        screen.getByText(`Необроблені високого пріоритету: ${expectedAfter}`),
      ).toBeInTheDocument(),
    );
  });
});
