'use client';

import type { WidgetParams } from './wompi.schema';

const WEB_CHECKOUT_URL = 'https://checkout.wompi.co/p/';

declare global {
  interface Window {
    WidgetCheckout?: new (config: WompiWidgetConfig) => {
      open: (callback: (result: WompiWidgetResult) => void) => void;
    };
  }
}

interface WompiWidgetConfig {
  currency: string;
  amountInCents: number;
  reference: string;
  publicKey: string;
  redirectUrl?: string; // opcional: Wompi lo rechaza con http:// (403 en iframe local)
  signature: { integrity: string };
}

export interface WompiWidgetResult {
  transaction?: {
    id: string;
    status: 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR' | 'PENDING';
    reference: string;
  };
}

/**
 * Construye la URL del Web Checkout de Wompi (método por redirección).
 * Los nombres de parámetro de Wompi llevan dos puntos literales (p. ej.
 * `signature:integrity`), por eso construimos el query sin URLSearchParams.
 */
export function buildWebCheckoutUrl(params: WidgetParams): string {
  const pairs = [
    ['public-key', params.publicKey],
    ['currency', params.currency],
    ['amount-in-cents', String(params.amountInCents)],
    ['reference', params.reference],
    ['signature:integrity', params.signature],
    ['redirect-url', params.redirectUrl],
  ];
  const query = pairs.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
  return `${WEB_CHECKOUT_URL}?${query}`;
}

export interface OpenWompiWidgetOptions {
  onResult?: (result: WompiWidgetResult) => void;
}

/**
 * Abre el pago de Wompi.
 *
 * Intenta primero el Widget modal JS (requiere que `widget.js` esté cargado via
 * el componente <Script> de Next.js). Si el global no está disponible, cae
 * automáticamente al Web Checkout por redirección de página completa.
 */
export function openWompiWidget(
  params: WidgetParams,
  options: OpenWompiWidgetOptions = {},
): void {
  if (!params.publicKey || !params.signature) {
    // Fallback directo: redirigimos al Web Checkout hospedado por Wompi.
    window.location.href = buildWebCheckoutUrl(params);
    return;
  }

  if (!window.WidgetCheckout) {
    // El script todavía no terminó de cargar (raro con strategy="afterInteractive")
    // o está bloqueado. El Web Checkout siempre funciona.
    console.warn('[Wompi] window.WidgetCheckout no disponible, usando Web Checkout.');
    window.location.href = buildWebCheckoutUrl(params);
    return;
  }

  try {
    const checkout = new window.WidgetCheckout({
      currency: params.currency,
      amountInCents: params.amountInCents,
      reference: params.reference,
      publicKey: params.publicKey,
      redirectUrl: params.redirectUrl,
      signature: { integrity: params.signature },
    });

    checkout.open((result) => options.onResult?.(result));
  } catch (err) {
    console.error('[Wompi] Error abriendo el Widget, usando Web Checkout:', err);
    window.location.href = buildWebCheckoutUrl(params);
  }
}
