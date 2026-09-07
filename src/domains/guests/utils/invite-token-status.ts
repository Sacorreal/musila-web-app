import type { InviteTokenErrorStatus } from '@/src/domains/guests/components/TokenErrorScreen';

export type InviteTokenStatus = 'valid' | InviteTokenErrorStatus;

export function getInviteTokenStatus(statusCode?: number): InviteTokenErrorStatus {
  if (statusCode === 400) return 'used';
  if (statusCode === 410) return 'expired';
  return 'not_found';
}
