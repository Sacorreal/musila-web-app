'use server';

import { apiURLs } from '@shared/constants/urls';
import {
  checkoutResponseSchema,
  type CheckoutInput,
  type CheckoutResponse,
} from './wompi.schema';

/**
 * Solicita al backend los parámetros del Widget de Wompi.
 * Se llama desde el cliente directamente — ver wompi.client-fetch.ts.
 * Este archivo conserva `'use server'` para futuras acciones que sí lo requieran.
 */
export async function createWompiCheckout(
  input: CheckoutInput,
): Promise<CheckoutResponse> {
  let res: Response;
  try {
    res = await fetch(apiURLs.payments.checkout, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new Error(
      'No pudimos contactar el servicio de pagos. Verifica tu conexión e inténtalo de nuevo.',
    );
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? 'No se pudo iniciar el proceso de pago');
  }

  const data = await res.json();
  return checkoutResponseSchema.parse(data);
}
