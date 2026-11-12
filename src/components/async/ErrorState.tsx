import { Button, InlineNotification } from '@carbon/react';
import { Renew } from '@carbon/icons-react';

interface ErrorStateProps {
  /** Short explanation of what failed, shown to the operator. */
  message?: string;
  /** Called by the retry action (R9). */
  onRetry: () => void;
}

/** Error state with a retry action (R9). */
export function ErrorState({
  message = 'Не вдалося отримати список подій. Перевірте з’єднання із сервером.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div style={{ padding: '1rem' }}>
      <InlineNotification
        kind="error"
        title="Помилка завантаження"
        subtitle={message}
        lowContrast
        hideCloseButton
      />
      <Button kind="tertiary" size="sm" renderIcon={Renew} onClick={onRetry}>
        Повторити
      </Button>
    </div>
  );
}
