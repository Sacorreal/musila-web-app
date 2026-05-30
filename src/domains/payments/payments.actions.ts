'use server';

import { apiURLs } from '@shared/constants/urls';
import type { PaymentPreference, PaymentRole, PaymentStatus } from './payments.types';

export async function createPaymentPreference(
  role: PaymentRole,
  plan: 'pro',
): Promise<PaymentPreference> {
  const res = await fetch(apiURLs.payments.createPreference, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, plan }),
    cache: 'no-store',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? 'No se pudo iniciar el proceso de pago');
  }

  return res.json() as Promise<PaymentPreference>;
}

export async function getPaymentStatus(reference: string): Promise<PaymentStatus> {
  const res = await fetch(apiURLs.payments.status(reference), {
    cache: 'no-store',
  });

  if (!res.ok) return { status: 'failed' };

  return res.json() as Promise<PaymentStatus>;
}
