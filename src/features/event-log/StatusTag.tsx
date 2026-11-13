import { Tag } from '@carbon/react';
import type { EventStatus, Priority } from '../../domain/event';
import { PRIORITY_LABELS, STATUS_LABELS } from './labels';

const PRIORITY_TAG_TYPE = {
  high: 'red',
  medium: 'warm-gray',
  low: 'gray',
} as const;

const STATUS_TAG_TYPE = {
  new: 'blue',
  in_progress: 'purple',
  closed: 'green',
} as const;

export function PriorityTag({ priority }: { priority: Priority }) {
  return (
    <Tag type={PRIORITY_TAG_TYPE[priority]} size="sm">
      {PRIORITY_LABELS[priority]}
    </Tag>
  );
}

export function StatusTag({ status }: { status: EventStatus }) {
  return (
    <Tag type={STATUS_TAG_TYPE[status]} size="sm">
      {STATUS_LABELS[status]}
    </Tag>
  );
}
