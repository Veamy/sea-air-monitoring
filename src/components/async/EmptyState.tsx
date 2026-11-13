import type { ReactNode } from 'react';

interface EmptyStateProps {
  /** Heading that says what is empty. */
  title: string;
  /** Explains why the list is empty, e.g. that no filter matches. */
  description: string;
  /** Optional action that helps leave the empty state, e.g. "clear filters". */
  action?: ReactNode;
}

/** Empty-data state with a message that explains the reason (R9). */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <section aria-labelledby="empty-state-title" style={{ padding: '1rem' }}>
      <h2 id="empty-state-title" style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
        {title}
      </h2>
      <p style={{ marginBottom: action ? '1rem' : undefined }}>{description}</p>
      {action}
    </section>
  );
}
