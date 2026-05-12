'use server';

import axios from 'axios';
import { BASE_API_URL } from '@/src/shared/constants/env';
import { GuestRegisteredResponse, InviteValidationResponse, RegisterGuestInput } from '../types/register-guest.types';

/**
 * Valida si un token de invitación es válido, no expirado y no utilizado.
 * Endpoint público — no requiere JWT.
 */
export async function validateInviteTokenAction(token: string): Promise<InviteValidationResponse> {
  try {
    const response = await axios.get<InviteValidationResponse>(`${BASE_API_URL}/invites/${token}`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const msg = error.response.data?.message || 'Error al validar la invitación';
      throw new Error(Array.isArray(msg) ? msg[0] : msg);
    }
    throw new Error('Error de conexión con el servidor');
  }
}

/**
 * Registra un nuevo guest a partir de un token de invitación.
 * Endpoint público — el token actúa como mecanismo de autorización.
 * POST /guests/register-from-invite
 */
export async function registerGuestAction(data: RegisterGuestInput): Promise<GuestRegisteredResponse> {
  try {
    const response = await axios.post<GuestRegisteredResponse>(
      `${BASE_API_URL}/guests/register-from-invite`,
      data,
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const msg = error.response.data?.message || 'Error al registrar el invitado';
      throw new Error(Array.isArray(msg) ? msg[0] : msg);
    }
    throw new Error('Error de conexión con el servidor');
  }
}
