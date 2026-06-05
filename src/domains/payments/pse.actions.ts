'use server';

import { apiURLs } from '@shared/constants/urls';
import type { PaymentRole } from './payments.types';

export interface PseBank {
  id: string;
  name: string;
}

export interface CreatePsePaymentInput {
  role: PaymentRole;
  plan: 'pro';
  billingPeriod?: 'monthly' | 'annual';
  email: string;
  firstName: string;
  lastName: string;
  entityType: 'individual' | 'association';
  identificationType: 'CC' | 'CE' | 'NIT' | 'TI' | 'PP';
  identificationNumber: string;
  financialInstitution: string;
}

export interface PsePaymentResult {
  redirectUrl: string;
  externalReference: string;
}

export async function getPseBanks(): Promise<PseBank[]> {
  const res = await fetch(apiURLs.payments.pseBanks, { cache: 'force-cache' });
  if (!res.ok) return [];
  return res.json() as Promise<PseBank[]>;
}

export async function createPsePayment(input: CreatePsePaymentInput): Promise<PsePaymentResult> {
  const res = await fetch(apiURLs.payments.psePay, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    cache: 'no-store',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any)?.message ?? 'No se pudo iniciar el pago PSE');
  }

  return res.json() as Promise<PsePaymentResult>;
}
