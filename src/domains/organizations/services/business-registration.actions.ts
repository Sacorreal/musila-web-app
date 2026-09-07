'use server';

import { cookies } from 'next/headers';
import { apiURLs } from '@/src/shared/constants/urls';
import { getServerApiClient } from '@/src/shared/libs/axios/axios-server';
import type {
  BusinessPlanDto,
  BusinessRegistrationResponse,
  CreateBusinessRegistrationInput,
} from '../types/business-registration.types';

/** `createBusinessForm` — endpoint público, sin sesión previa. */
export async function registerBusinessAction(
  dto: CreateBusinessRegistrationInput,
): Promise<BusinessRegistrationResponse> {
  const cookieStore = await cookies();

  const response = await fetch(apiURLs.auth.registerBusiness, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const msg = errorData.message ?? 'Error al registrar la organización';
    throw new Error(Array.isArray(msg) ? msg.join(', ') : String(msg));
  }

  const data: BusinessRegistrationResponse = await response.json();

  cookieStore.set('access_token', data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });

  return data;
}

/** Planes B2B activos disponibles para elegir en el formulario (público). */
export async function fetchBusinessPlansAction(): Promise<BusinessPlanDto[]> {
  const response = await fetch(apiURLs.plans.business, { cache: 'no-store' });
  if (!response.ok) return [];
  return response.json();
}

export interface OwnOrganization {
  id: string;
  name: string;
  slug: string;
  status: 'EN_TRAMITE' | 'APROBADA' | 'CREADA' | 'VERIFICADA' | 'RECHAZADA';
  rejectionReason?: string | null;
}

/** Detalle de la organización propia durante el onboarding. Requiere sesión. */
export async function fetchMyOrganizationAction(organizationId: string): Promise<OwnOrganization> {
  const client = await getServerApiClient();
  const response = await client.get<OwnOrganization>(apiURLs.organizations.mine(organizationId));
  return response.data;
}

export interface OwnTrackspace {
  id: string;
  name: string;
  logoUrl?: string | null;
  isDefault: boolean;
}

/** Trackspace(s) de la organización propia (para personalizar nombre + logo, §5). */
export async function fetchMyTrackspacesAction(organizationId: string): Promise<OwnTrackspace[]> {
  const client = await getServerApiClient();
  const response = await client.get<OwnTrackspace[]>(apiURLs.organizations.trackspaces(organizationId));
  return response.data;
}

export async function updateMyTrackspaceAction(
  organizationId: string,
  trackspaceId: string,
  input: { name?: string; logoUrl?: string | null },
): Promise<OwnTrackspace> {
  const client = await getServerApiClient();
  const response = await client.patch<OwnTrackspace>(
    apiURLs.organizations.trackspaceById(organizationId, trackspaceId),
    input,
  );
  return response.data;
}

/** Activar el primer perfil de administrador (§5). Requiere sesión. */
export async function activateOrganizationAdminAction(organizationId: string) {
  const client = await getServerApiClient();
  const response = await client.post(apiURLs.organizations.activateAdmin(organizationId));
  return response.data;
}

/** Verificar si la organización ya cumple todos los requisitos (§7). Idempotente. */
export async function checkOrganizationVerificationAction(organizationId: string) {
  const client = await getServerApiClient();
  const response = await client.post(apiURLs.organizations.checkVerification(organizationId));
  return response.data;
}
