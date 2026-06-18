'use server';

import { apiURLs } from '@shared/constants/urls';
import type { PaymentStatus } from './payments.types';

export async function getPaymentStatus(reference: string): Promise<PaymentStatus> {
  const res = await fetch(apiURLs.payments.status(reference), {
    cache: 'no-store',
  });

  if (!res.ok) return { status: 'failed' };

  return res.json() as Promise<PaymentStatus>;
}

export async function getLicensePaymentStatus(reference: string): Promise<{ status: string; requestedTrackId?: string }> {
  const res = await fetch(apiURLs.payments.licenseStatus(reference), {
    cache: 'no-store',
  });

  if (!res.ok) return { status: 'failed' };

  return res.json() as Promise<{ status: string; requestedTrackId?: string }>;
}
