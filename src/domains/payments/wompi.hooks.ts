'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { apiURLs } from '@shared/constants/urls';
import { getPaymentStatus, getLicensePaymentStatus } from './payments.actions';
import { openWompiWidget, type WompiWidgetResult } from './wompi.client';
import {
  checkoutResponseSchema,
  licenseCheckoutResponseSchema,
  licenseInstallmentCheckoutResponseSchema,
  type CheckoutInput,
  type CheckoutResponse,
  type LicenseCheckoutResponse,
  type LicenseInstallmentCheckoutResponse,
} from './wompi.schema';
import { apiClient } from '@shared/libs/axios/axios-client';

interface UseWompiCheckoutOptions {
  onResult?: (reference: string, result: WompiWidgetResult) => void;
}

/**
 * Fetch directo navegador → backend para obtener los parámetros del Widget.
 * Se hace desde el cliente (no server action) porque `localhost:3001` solo es
 * accesible desde el navegador, no desde el servidor de Next.js.
 */
async function fetchCheckoutParams(input: CheckoutInput) {
  let res: Response;
  try {
    res = await fetch(apiURLs.payments.checkout, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new Error('No se pudo contactar el servicio de pagos. Verifica tu conexión.');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string })?.message ?? 'No se pudo iniciar el pago');
  }

  const data = await res.json();
  return checkoutResponseSchema.parse(data);
}

/**
 * Inicia el checkout: hace fetch al backend desde el navegador y abre el pago
 * de Wompi (Widget modal si el script cargó, Web Checkout por redirección si no).
 * La mutación resuelve en cuanto se dispara la apertura.
 */
export function useWompiCheckout(options: UseWompiCheckoutOptions = {}) {
  return useMutation({
    mutationFn: async (input: CheckoutInput) => {
      const { widget, externalReference } = await fetchCheckoutParams(input);
      sessionStorage.setItem('wompi_pending_ref', externalReference);
      openWompiWidget(widget, {
        onResult: (result) => options.onResult?.(externalReference, result),
      });
      return { reference: externalReference };
    },
  });
}

async function fetchLicenseCheckoutParams(requestedTrackId: string): Promise<LicenseCheckoutResponse> {
  const { data } = await apiClient.post<LicenseCheckoutResponse>('/payments/license-checkout', { requestedTrackId });
  return licenseCheckoutResponseSchema.parse(data);
}

interface UseLicenseCheckoutOptions {
  onResult?: (reference: string, result: WompiWidgetResult) => void;
}

export function useLicenseCheckout(options: UseLicenseCheckoutOptions = {}) {
  return useMutation({
    mutationFn: async (requestedTrackId: string) => {
      const checkout = await fetchLicenseCheckoutParams(requestedTrackId);
      sessionStorage.setItem('wompi_license_ref', checkout.externalReference);
      openWompiWidget(checkout.widget, {
        onResult: (result) => options.onResult?.(checkout.externalReference, result),
      });
      return {
        reference: checkout.externalReference,
        licensePrice: checkout.licensePrice,
        commission: checkout.commission,
        total: checkout.total,
      };
    },
  });
}

async function fetchLicenseInstallmentCheckoutParams(collectionId: string): Promise<LicenseInstallmentCheckoutResponse> {
  const { data } = await apiClient.post('/payments/license-installment-checkout', { collectionId });
  return licenseInstallmentCheckoutResponseSchema.parse(data);
}

interface UseLicenseInstallmentCheckoutOptions {
  onResult?: (reference: string, result: WompiWidgetResult) => void;
}

/** Checkout de una cuota de anticipo de un contrato de licencia de primer uso generado en línea. */
export function useLicenseInstallmentCheckout(options: UseLicenseInstallmentCheckoutOptions = {}) {
  return useMutation({
    mutationFn: async (collectionId: string) => {
      const checkout = await fetchLicenseInstallmentCheckoutParams(collectionId);
      openWompiWidget(checkout.widget, {
        onResult: (result) => options.onResult?.(checkout.externalReference, result),
      });
      return {
        reference: checkout.externalReference,
        installmentAmount: checkout.installmentAmount,
        commission: checkout.commission,
        total: checkout.total,
      };
    },
  });
}

const POLL_INTERVAL_MS = 3000;

export function useLicensePaymentStatusPolling(reference: string | null) {
  return useQuery({
    queryKey: ['license-payment-status', reference],
    enabled: Boolean(reference),
    queryFn: () => getLicensePaymentStatus(reference as string),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'approved' || status === 'failed' || status === 'not_found') return false;
      return POLL_INTERVAL_MS;
    },
  });
}

export function usePaymentStatusPolling(reference: string | null) {
  return useQuery({
    queryKey: ['payment-status', reference],
    enabled: Boolean(reference),
    queryFn: () => getPaymentStatus(reference as string),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'approved' || status === 'expired' || status === 'not_found') {
        return false;
      }
      return POLL_INTERVAL_MS;
    },
  });
}
