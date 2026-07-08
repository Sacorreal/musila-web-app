'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiURLs } from '@/src/shared/constants/urls';
import type {
  AffiliateAuthResponse,
  LoginAffiliateInput,
  RegisterAffiliateInput,
} from '../types/affiliate.types';

function setAffiliateCookie(cookieStore: Awaited<ReturnType<typeof cookies>>, token: string) {
  cookieStore.set('affiliate_access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });
}

export async function registerAffiliateRequest(dto: RegisterAffiliateInput): Promise<string> {
  const cookieStore = await cookies();

  const response = await fetch(apiURLs.affiliates.register, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const msg = errorData.message ?? 'Error al registrar el afiliado';
    throw new Error(Array.isArray(msg) ? msg.join(', ') : String(msg));
  }

  const data: AffiliateAuthResponse = await response.json();
  setAffiliateCookie(cookieStore, data.token);
  return data.token;
}

export async function loginAffiliateRequest(dto: LoginAffiliateInput): Promise<string> {
  const cookieStore = await cookies();

  const response = await fetch(apiURLs.affiliates.login, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    throw new Error('Credenciales incorrectas');
  }

  const data: AffiliateAuthResponse = await response.json();
  setAffiliateCookie(cookieStore, data.token);
  return data.token;
}

export async function deleteAffiliateCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('affiliate_access_token');
  redirect('/programa-afiliados/login');
}
