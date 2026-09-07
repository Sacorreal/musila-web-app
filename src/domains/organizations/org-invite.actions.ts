'use server'

import { cookies } from 'next/headers'
import axios from 'axios'
import { BASE_API_URL } from '@/src/shared/constants/env'
import { apiURLs } from '@/src/shared/constants/urls'
import type {
  OrgInviteValidationResponse,
  RegisterOrgAdminInput,
  RegisterOrgAdminResponse,
} from './org-invite.types'

/**
 * Valida el token de invitación de una organización. Endpoint público — no
 * requiere JWT; el token actúa como mecanismo de autorización.
 */
export async function validateOrgInviteAction(
  token: string,
): Promise<OrgInviteValidationResponse> {
  try {
    const response = await axios.get<OrgInviteValidationResponse>(
      apiURLs.organizations.invitePublic(token),
    )
    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const msg = error.response.data?.message || 'Error al validar la invitación'
      const wrapped = new Error(Array.isArray(msg) ? msg[0] : msg) as Error & { status?: number }
      wrapped.status = error.response.status
      throw wrapped
    }
    throw new Error('Error de conexión con el servidor')
  }
}

/**
 * Registra al Organization Admin a partir del token. Al crear la cuenta el
 * backend devuelve el JWT; lo guardamos como cookie httpOnly para dejar la
 * sesión iniciada, igual que el registro de usuario estándar.
 */
export async function registerOrgAdminAction(
  data: RegisterOrgAdminInput,
): Promise<RegisterOrgAdminResponse> {
  try {
    const response = await axios.post<RegisterOrgAdminResponse>(
      apiURLs.auth.registerOrgAdmin,
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
