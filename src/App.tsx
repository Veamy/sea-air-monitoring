import { Navigate, Route, Routes } from 'react-router-dom';
import { Theme } from '@carbon/react';
import { EventLogPage } from './features/event-log/EventLogPage';
import { ShellLayout } from './layout/ShellLayout';
import { UI_THEME } from './theme/theme';

export function App() {
  return (
    <Theme theme={UI_THEME}>
      <Routes>
        <Route element={<ShellLayout />}>
          <Route path="/" element={<EventLogPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Theme>
  );
}
