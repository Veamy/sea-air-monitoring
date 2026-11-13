import type { EventStatus, EventType, Priority } from '../../domain/event';

/** Ukrainian labels for the domain values (N4). */
export const TYPE_LABELS: Record<EventType, string> = {
  contact: 'Контакт',
  crossing: 'Перетин межі',
  anomaly: 'Аномалія руху',
  lost_contact: 'Втрата контакту',
  other: 'Інше',
};

export const STATUS_LABELS: Record<EventStatus, string> = {
  new: 'Нова',
  in_progress: 'В роботі',
  closed: 'Закрита',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: 'Високий',
  medium: 'Середній',
  low: 'Низький',
};
