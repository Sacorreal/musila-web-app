'use server';

import { cookies } from 'next/headers';
import { apiURLs } from '@shared/constants/urls';

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

// ── Perfil ────────────────────────────────────────────────────────────────────

export async function getUserProfile() {
  const res = await authFetch(apiURLs.me.profile);
  if (!res.ok) throw new Error('No se pudo obtener el perfil');
  return res.json();
}

export async function updateUserProfile(data: Record<string, unknown>) {
  const res = await authFetch(apiURLs.me.profile, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? 'No se pudo actualizar el perfil');
  }
  return res.json();
}

export async function changeEmail(newEmail: string) {
  const res = await authFetch(apiURLs.me.email, {
    method: 'PATCH',
    body: JSON.stringify({ newEmail }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? 'No se pudo actualizar el correo');
  }
  return res.json();
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const res = await authFetch(apiURLs.me.password, {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? 'No se pudo cambiar la contraseña');
  }
}

export async function updateAvatar(avatarUrl: string, avatarKey?: string) {
  const res = await authFetch(apiURLs.me.avatar, {
    method: 'PATCH',
    body: JSON.stringify({ avatarUrl, avatarKey }),
  });
  if (!res.ok) throw new Error('No se pudo actualizar el avatar');
  return res.json();
}

// ── Plan ──────────────────────────────────────────────────────────────────────

export async function getPlanStatus() {
  const res = await authFetch(apiURLs.me.plan);
  if (!res.ok) throw new Error('No se pudo obtener el estado del plan');
  return res.json();
}

// ── Facturación ───────────────────────────────────────────────────────────────

export async function getBillingInfo() {
  const res = await authFetch(apiURLs.me.billing);
  if (!res.ok) throw new Error('No se pudo obtener los datos de facturación');
  return res.json();
}

export async function updateBillingInfo(data: { fiscalName?: string; taxId?: string; fiscalAddress?: string }) {
  const res = await authFetch(apiURLs.me.billing, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? 'No se pudo actualizar los datos de facturación');
  }
  return res.json();
}

// ── Fuente de pago (tarjeta) ──────────────────────────────────────────────────

export async function getPaymentSource() {
  const res = await authFetch(apiURLs.payments.paymentSourceMe);
  if (!res.ok) throw new Error('No se pudo obtener el método de pago');
  return res.json() as Promise<{ id: string; brand?: string; last4?: string } | null>;
}

export async function deletePaymentSource(id: string) {
  const res = await authFetch(apiURLs.payments.paymentSourceById(id), { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any)?.message ?? 'No se pudo eliminar el método de pago');
  }
}

export async function addPaymentSource(dto: {
  number: string;
  cvc: string;
  expMonth: string;
  expYear: string;
  cardHolder: string;
  customerEmail: string;
}) {
  const res = await authFetch(apiURLs.payments.paymentSources, {
    method: 'POST',
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any)?.message ?? 'No se pudo guardar la tarjeta');
  }
  return res.json() as Promise<{ id: string; brand?: string; last4?: string; status: string }>;
}

// ── Historial de pagos ────────────────────────────────────────────────────────

export async function getPaymentHistory(
  page = 1,
  limit = 10,
  status?: string,
  from?: string,
  to?: string,
) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) params.set('status', status);
  if (from) params.set('from', from);
  if (to) params.set('to', to);

  const res = await authFetch(`${apiURLs.me.paymentHistory}?${params}`);
  if (!res.ok) throw new Error('No se pudo cargar el historial de pagos');
  return res.json();
}

export async function getPaymentById(id: string) {
  const res = await authFetch(apiURLs.payments.byId(id));
  if (!res.ok) throw new Error('No se pudo obtener el pago');
  return res.json();
}
