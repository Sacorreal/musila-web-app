'use server';

import { cookies } from 'next/headers';
import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/browser';

import { apiURLs } from '@shared/constants/urls';
import type {
  MfaStatus,
  OrganizationSecurityPolicy,
  PasskeySummary,
  StepUpMethod,
  TotpSetupResult,
} from '../types/security.types';
import type { OrganizationSecurityPolicyInput } from '../schema/security.schema';

async function authFetch(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> | undefined),
    },
    cache: 'no-store',
  });
}

async function unwrap<T>(res: Response, fallback: string): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.message ?? fallback;
    throw new Error(Array.isArray(msg) ? msg.join(', ') : String(msg));
  }
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

// ── Passkeys: registro ──────────────────────────────────────────────

export async function getPasskeyRegistrationOptions(): Promise<PublicKeyCredentialCreationOptionsJSON> {
  const res = await authFetch(apiURLs.security.passkeys.registerOptions, { method: 'POST' });
  return unwrap(res, 'No se pudieron generar las opciones de registro');
}

export async function verifyPasskeyRegistration(
  response: RegistrationResponseJSON,
  name?: string,
): Promise<PasskeySummary> {
  const res = await authFetch(apiURLs.security.passkeys.registerVerify, {
    method: 'POST',
    body: JSON.stringify({ response, name }),
  });
  return unwrap(res, 'No se pudo registrar la Passkey');
}

// ── Passkeys: login (público, setea cookie) ─────────────────────────

export async function getPasskeyLoginOptions(): Promise<PublicKeyCredentialRequestOptionsJSON> {
  const res = await fetch(apiURLs.security.passkeys.loginOptions, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  return unwrap(res, 'No se pudieron generar las opciones de inicio de sesión');
}

export async function verifyPasskeyLogin(
  response: AuthenticationResponseJSON,
): Promise<{ token: string }> {
  const res = await fetch(apiURLs.security.passkeys.loginVerify, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ response }),
    cache: 'no-store',
  });
  const data = await unwrap<{ token: string }>(res, 'No se pudo iniciar sesión con la Passkey');

  const cookieStore = await cookies();
  cookieStore.set('access_token', data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });

  return data;
}

// ── Passkeys: gestión ───────────────────────────────────────────────

export async function listPasskeys(): Promise<PasskeySummary[]> {
  const res = await authFetch(apiURLs.security.passkeys.base);
  return unwrap(res, 'No se pudieron obtener las Passkeys');
}

export async function renamePasskey(id: string, name: string): Promise<PasskeySummary> {
  const res = await authFetch(apiURLs.security.passkeys.rename(id), {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  return unwrap(res, 'No se pudo renombrar la Passkey');
}

export async function revokePasskey(id: string): Promise<void> {
  const res = await authFetch(apiURLs.security.passkeys.byId(id), { method: 'DELETE' });
  return unwrap(res, 'No se pudo revocar la Passkey');
}

// ── MFA / TOTP ──────────────────────────────────────────────────────

export async function getMfaStatus(organizationId?: string): Promise<MfaStatus> {
  const url = organizationId
    ? `${apiURLs.security.mfa.status}?organizationId=${encodeURIComponent(organizationId)}`
    : apiURLs.security.mfa.status;
  const res = await authFetch(url);
  return unwrap(res, 'No se pudo obtener el estado MFA');
}

export async function setupTotp(): Promise<TotpSetupResult> {
  const res = await authFetch(apiURLs.security.mfa.totpSetup, { method: 'POST' });
  return unwrap(res, 'No se pudo iniciar la configuración de TOTP');
}

export async function confirmTotp(token: string): Promise<void> {
  const res = await authFetch(apiURLs.security.mfa.totpConfirm, {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
  return unwrap(res, 'No se pudo confirmar el TOTP');
}

export async function disableTotp(): Promise<void> {
  const res = await authFetch(apiURLs.security.mfa.totpDisable, { method: 'DELETE' });
  return unwrap(res, 'No se pudo desactivar el TOTP');
}

// ── Recovery Codes ──────────────────────────────────────────────────

export async function regenerateRecoveryCodes(): Promise<{ codes: string[] }> {
  const res = await authFetch(apiURLs.security.recoveryCodes.regenerate, { method: 'POST' });
  return unwrap(res, 'No se pudieron regenerar los Recovery Codes');
}

// ── Step-up ─────────────────────────────────────────────────────────

export async function getStepUpChallenge(
  scope: string,
): Promise<PublicKeyCredentialRequestOptionsJSON> {
  const res = await authFetch(apiURLs.security.mfa.stepUpChallenge, {
    method: 'POST',
    body: JSON.stringify({ scope }),
  });
  return unwrap(res, 'No se pudo generar el desafío de verificación');
}

export async function verifyStepUp(input: {
  scope: string;
  method: StepUpMethod;
  response?: AuthenticationResponseJSON;
  token?: string;
}): Promise<{ grantedUntil: string }> {
  const res = await authFetch(apiURLs.security.mfa.stepUp, {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return unwrap(res, 'No se pudo completar la verificación');
}

// ── Política de organización ────────────────────────────────────────

export async function getOrganizationPolicy(
  orgId: string,
): Promise<OrganizationSecurityPolicy> {
  const res = await authFetch(apiURLs.security.organizationPolicy(orgId));
  return unwrap(res, 'No se pudo obtener la política de seguridad');
}

export async function updateOrganizationPolicy(
  orgId: string,
  input: OrganizationSecurityPolicyInput,
): Promise<OrganizationSecurityPolicy> {
  const res = await authFetch(apiURLs.security.organizationPolicy(orgId), {
    method: 'PUT',
    body: JSON.stringify(input),
  });
  return unwrap(res, 'No se pudo actualizar la política de seguridad');
}
