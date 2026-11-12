import { Outlet } from 'react-router-dom';
import { useEventsQuery } from '../hooks/useEvents';
import { countUnprocessedHighPriority } from '../domain/event';
import { AppShell } from './AppShell';

/** Connects the shell to the shared event list so the header counter stays current. */
export function ShellLayout() {
  const { data } = useEventsQuery();
  const count = data ? countUnprocessedHighPriority(data) : null;
  return (
    <AppShell unprocessedHighPriority={count}>
      <Outlet />
    </AppShell>
  );
}
