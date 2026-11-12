import { Theme } from '@carbon/react';
import { UI_THEME } from './theme/theme';

export function App() {
  return (
    <Theme theme={UI_THEME}>
      <div style={{ minHeight: '100vh', background: 'var(--cds-background)' }}>
        <h1>Моніторинг обстановки</h1>
      </div>
    </Theme>
  );
}
