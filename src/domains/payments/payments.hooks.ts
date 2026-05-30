'use client';

import { useMutation } from '@tanstack/react-query';
import { createPaymentPreference } from './payments.actions';
import type { PaymentRole } from './payments.types';

export function useCreatePaymentPreference() {
  return useMutation({
    mutationFn: ({ role, plan }: { role: PaymentRole; plan: 'pro' }) =>
      createPaymentPreference(role, plan),
  });
}
