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
