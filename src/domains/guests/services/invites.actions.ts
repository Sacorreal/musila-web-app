'use server';

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server';
import { CreateInviteInput, InviteResponse } from '../types/invite.types';

/**
 * Server Action: Crea una nueva invitación a través del backend.
 * Requiere JWT válido (se inyecta automáticamente desde la cookie).
 */
export async function createInviteAction(data: CreateInviteInput): Promise<InviteResponse> {
  const client = await getServerApiClient();
  const response = await client.post<InviteResponse>('/invites', data);
  return response.data;
}
