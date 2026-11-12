import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@carbon/styles/css/styles.css';
import { App } from './App';

async function enableMocks(): Promise<void> {
  if (!import.meta.env.DEV) return;
  const { worker } = await import('./mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

void enableMocks().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
