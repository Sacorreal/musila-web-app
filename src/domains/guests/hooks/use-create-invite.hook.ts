'use client';

import { useMutation } from '@tanstack/react-query';
import { createInviteAction } from '../services/invites.actions';
import { CreateInviteInput, InviteResponse } from '../types/invite.types';

/**
 * Hook para crear una invitación de usuario (guest).
 * Llama al Server Action y retorna el token, URL e imagen QR.
 */
export function useCreateInvite() {
  return useMutation<InviteResponse, Error, CreateInviteInput>({
    mutationFn: createInviteAction,
  });
}
