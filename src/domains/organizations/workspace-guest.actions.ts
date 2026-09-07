'use server'

import { cookies } from 'next/headers'
import axios from 'axios'
import { apiURLs } from '@/src/shared/constants/urls'
import type { WorkspaceGuestRegisterInput } from './workspace-guest.schema'

export interface RegisterWorkspaceGuestResponse {
  token: string
  organizationId: string
  status: 'PENDING'
}

/**
 * Registra a un invitado a partir del enlace de workspace. El backend devuelve
 * el JWT; lo guardamos como cookie httpOnly para dejar la sesión iniciada. El
 * usuario queda con una solicitud de acceso pendiente de aprobación.
 */
export async function registerWorkspaceGuestAction(
  data: WorkspaceGuestRegisterInput & { token: string },
): Promise<RegisterWorkspaceGuestResponse> {
  try {
    const response = await axios.post<RegisterWorkspaceGuestResponse>(
      apiURLs.auth.registerWorkspaceGuest,
      data,
    )

    const cookieStore = await cookies()
    cookieStore.set('access_token', response.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    })

    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const msg = error.response.data?.message || 'Error al crear la cuenta'
      throw new Error(Array.isArray(msg) ? msg[0] : msg)
    }
    throw new Error('Error de conexión con el servidor')
  }
}
