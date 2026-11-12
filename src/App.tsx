import { Navigate, Route, Routes } from 'react-router-dom';
import { Theme } from '@carbon/react';
import { ShellLayout } from './layout/ShellLayout';
import { UI_THEME } from './theme/theme';

/** Temporary stand-in until the event log view is added. */
function EventLogPlaceholder() {
  return <h1>Журнал подій</h1>;
}

export function App() {
  return (
    <Theme theme={UI_THEME}>
      <Routes>
        <Route element={<ShellLayout />}>
          <Route path="/" element={<EventLogPlaceholder />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Theme>
  );
}
