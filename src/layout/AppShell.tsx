import type { ReactNode } from 'react';
import { Content, Header, HeaderGlobalBar, HeaderName, SkipToContent, Tag } from '@carbon/react';

interface AppShellProps {
  /** Unprocessed high-priority events; null while the count is not known yet. */
  unprocessedHighPriority: number | null;
  children: ReactNode;
}

/** Application frame: header with the title and the high-priority counter (R8). */
export function AppShell({ unprocessedHighPriority, children }: AppShellProps) {
  return (
    <>
      <SkipToContent />
      <Header aria-label="Журнал подій оператора">
        <HeaderName href="/" prefix="">
          Журнал подій
        </HeaderName>
        <HeaderGlobalBar>
          <div className="app-shell__counter" role="status" aria-live="polite">
            <Tag type="red" size="md">
              Необроблені високого пріоритету:{' '}
              {unprocessedHighPriority === null ? '…' : unprocessedHighPriority}
            </Tag>
          </div>
        </HeaderGlobalBar>
      </Header>
      <Content id="main-content">{children}</Content>
    </>
  );
}
