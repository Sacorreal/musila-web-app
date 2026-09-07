'use server'

import axios from 'axios'
import { apiURLs } from '@/src/shared/constants/urls'
import type { WorkspaceInviteValidation } from './organizations.types'

/**
 * Valida el enlace de invitación reutilizable del workspace. Endpoint público —
 * no requiere JWT; el token del enlace actúa como mecanismo de autorización.
 */
export async function validateWorkspaceInviteAction(
  token: string,
): Promise<WorkspaceInviteValidation> {
  try {
    const response = await axios.get<WorkspaceInviteValidation>(
      apiURLs.organizations.workspaceInvitePublic(token),
    )
    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const msg = error.response.data?.message || 'Error al validar el enlace de invitación'
      const wrapped = new Error(Array.isArray(msg) ? msg[0] : msg) as Error & { status?: number }
      wrapped.status = error.response.status
      throw wrapped
    }
    throw new Error('Error de conexión con el servidor')
  }
}
