import { InlineLoading } from '@carbon/react';

interface LoadingStateProps {
  /** Text shown next to the spinner, e.g. "Завантаження подій…". */
  description?: string;
}

/** Loading state of a view or a region (R9). */
export function LoadingState({ description = 'Завантаження даних…' }: LoadingStateProps) {
  return (
    <div role="status" aria-live="polite" style={{ padding: '1rem' }}>
      <InlineLoading description={description} status="active" />
    </div>
  );
}
