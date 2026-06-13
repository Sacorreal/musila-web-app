'use client';

// Hooks de pago. El flujo de checkout con Wompi vive en `wompi.hooks.ts`
// (useWompiCheckout / usePaymentStatusPolling).
export { useWompiCheckout, usePaymentStatusPolling, useLicenseCheckout, useLicensePaymentStatusPolling } from './wompi.hooks';
