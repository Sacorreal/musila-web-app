'use client';

import { Button } from '@/src/shared/components/UI/button';
import { Switch } from '@/src/shared/components/UI/switch';
import { Check, Loader2, ShieldCheck } from 'lucide-react';
import { useRef, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PRO_PLANS } from '@/src/domains/landing/constants/plans';
import type { CurrencyInfo } from '../currency.actions';
import { convertPrice } from '../currency.utils';
import { checkoutResponseSchema } from '../wompi.schema';
import type { WompiPaymentRole } from '../wompi.schema';
import '../wompi.client'; // importa el declare global de window.WidgetCheckout

const BACKEND_CHECKOUT = process.env.NEXT_PUBLIC_API_URL + '/payments/checkout';
const WEB_CHECKOUT = 'https://checkout.wompi.co/p/';

interface CheckoutCartProps {
  role: WompiPaymentRole;
  defaultAnnual?: boolean;
  currencyInfo: CurrencyInfo;
}

function fmtCop(n: number) {
  return `$${n.toLocaleString('es-CO')} COP`;
}

/** Construye la URL del Web Checkout de Wompi (fallback sin JS). */
function buildWebCheckoutUrl(w: {
  publicKey: string;
  currency: string;
  amountInCents: number;
  reference: string;
  signature: string;
  redirectUrl: string;
}): string {
  const parts = [
    `public-key=${encodeURIComponent(w.publicKey)}`,
    `currency=${encodeURIComponent(w.currency)}`,
    `amount-in-cents=${encodeURIComponent(String(w.amountInCents))}`,
    `reference=${encodeURIComponent(w.reference)}`,
    `signature:integrity=${encodeURIComponent(w.signature)}`,
    `redirect-url=${encodeURIComponent(w.redirectUrl)}`,
  ];
  return `${WEB_CHECKOUT}?${parts.join('&')}`;
}

export function CheckoutCart({ role, defaultAnnual = false, currencyInfo }: CheckoutCartProps) {
  const router = useRouter();
  const plan = useMemo(() => PRO_PLANS.find((p) => p.role === role), [role]);
  const isLifetime = role === 'interprete';
  const hasAnnual = !!plan?.annualTotalPrice && !isLifetime;
  const [annual, setAnnual] = useState(defaultAnnual && hasAnnual);
  const [paying, setPaying] = useState(false);
  const showLocalCurrency = !currencyInfo.isCOP;

  /**
   * Contenedor donde se inyecta el <form><script data-render="button"> de Wompi.
   * Se mantiene visible para que el click programático funcione. Está cubierto
   * visualmente por nuestro botón mientras `paying` es false.
   */
  const wompiFormRef = useRef<HTMLDivElement>(null);

  if (!plan) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">El plan seleccionado no está disponible.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/#pricing')}>
          Ver planes
        </Button>
      </div>
    );
  }

  const monthly = plan.price ?? 0;
  const amount = isLifetime ? monthly : annual ? plan.annualTotalPrice! : monthly;
  const billingLabel = isLifetime
    ? 'Pago único'
    : annual
      ? 'Facturación anual'
      : 'Facturación mensual';

  async function handlePay() {
    if (paying) return;
    setPaying(true);
    console.log('[Wompi] paso 1: iniciando pago');

    // ── 1. Parámetros del backend ─────────────────────────────────────────────
    let widget: {
      publicKey: string; currency: string; amountInCents: number;
      reference: string; signature: string; redirectUrl: string;
    };

    try {
      console.log('[Wompi] paso 2: fetch a', BACKEND_CHECKOUT);
      const res = await fetch(BACKEND_CHECKOUT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, plan: 'pro', billingPeriod: annual ? 'annual' : 'monthly' }),
        signal: AbortSignal.timeout(15000),
      });
      console.log('[Wompi] paso 3: respuesta HTTP', res.status);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? 'Error del servidor de pagos');
      }
      const parsed = checkoutResponseSchema.parse(await res.json());
      widget = parsed.widget;
      console.log('[Wompi] paso 4: parámetros OK', widget);
      sessionStorage.setItem('wompi_pending_ref', parsed.externalReference);
    } catch (err) {
      console.error('[Wompi] ERROR en fetch:', err);
      setPaying(false);
      toast.error('No se pudo iniciar el pago', {
        description: err instanceof Error ? err.message : 'Intenta nuevamente.',
      });
      return;
    }

    // ── 2. Inyectar <form><script data-render="button"> (API declarativa de Wompi) ─
    const container = wompiFormRef.current;
    if (!container) {
      console.warn('[Wompi] contenedor null → Web Checkout');
      window.location.href = buildWebCheckoutUrl(widget);
      return;
    }

    container.innerHTML = '';
    const form = document.createElement('form');
    const script = document.createElement('script');
    script.src = 'https://checkout.wompi.co/widget.js';
    script.setAttribute('data-render', 'button');
    script.setAttribute('data-public-key', widget.publicKey);
    script.setAttribute('data-currency', widget.currency);
    script.setAttribute('data-amount-in-cents', String(widget.amountInCents));
    script.setAttribute('data-reference', widget.reference);
    script.setAttribute('data-signature:integrity', widget.signature);
    script.setAttribute('data-redirect-url', widget.redirectUrl);

    script.addEventListener('load', () => {
      console.log('[Wompi] paso 5: widget.js cargado, abriendo con JS API');
      if (!window.WidgetCheckout) {
        console.warn('[Wompi] window.WidgetCheckout no definido → Web Checkout');
        window.location.href = buildWebCheckoutUrl(widget);
        return;
      }

      // Usamos la API JS en vez de hacer click en el botón porque el botón
      // incluye data-redirect-url=http://localhost:3000 en la URL del iframe
      // y Wompi rechaza URLs no-HTTPS con 403. Sin redirectUrl el iframe carga
      // bien; navegamos a /pending desde el callback tras el pago.
      const instance = new window.WidgetCheckout({
        currency: widget.currency,
        amountInCents: widget.amountInCents,
        reference: widget.reference,
        publicKey: widget.publicKey,
        signature: { integrity: widget.signature },
        // redirectUrl omitido en local (http://localhost → 403 en el iframe).
        // En producción (HTTPS) se puede incluir; el callback ya cubre la navegación.
      });

      setPaying(false);
      instance.open((result) => {
        console.log('[Wompi] pago finalizado', result?.transaction?.status);
        router.push(`/register/pro/pending?ref=${widget.reference}`);
      });
    });

    script.addEventListener('error', () => {
      console.error('[Wompi] widget.js bloqueado → Web Checkout');
      window.location.href = buildWebCheckoutUrl(widget);
    });

    console.log('[Wompi] paso 4.5: inyectando script en DOM');
    form.appendChild(script);
    container.appendChild(form);
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Panel izquierdo: detalle del plan */}
      <section
        aria-labelledby="plan-detail-title"
        className="rounded-2xl border border-border bg-card p-6 sm:p-8"
      >
        {plan.badge && (
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {plan.badge}
          </span>
        )}
        <h2 id="plan-detail-title" className="mt-3 text-2xl font-bold text-foreground">
          {plan.name}
        </h2>
        <p className="mt-1 text-sm font-medium text-primary">{plan.mainBenefit}</p>

        <ul className="mt-6 space-y-3">
          {plan.features.map((f) => (
            <li key={f.label} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              {f.label}
            </li>
          ))}
        </ul>
      </section>

      {/* Panel derecho: resumen de pago */}
      <section
        aria-labelledby="payment-summary-title"
        className="flex flex-col rounded-2xl border border-border bg-gradient-to-br from-card to-primary/5 p-6 sm:p-8"
      >
        <h2 id="payment-summary-title" className="text-lg font-bold text-foreground">
          Resumen de pago
        </h2>

        {hasAnnual && (
          <label className="mt-5 flex items-center justify-between rounded-xl border border-border bg-background/60 p-4">
            <span className="flex flex-col">
              <span className="text-sm font-medium text-foreground">Pago anual</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400">
                Ahorra {convertPrice(monthly * 12 - plan.annualTotalPrice!, currencyInfo)} al año
              </span>
            </span>
            <Switch
              checked={annual}
              onCheckedChange={setAnnual}
              aria-label="Alternar pago anual"
            />
          </label>
        )}

        <div className="mt-6 flex items-end justify-between">
          <span className="text-sm text-muted-foreground">{billingLabel}</span>
          <div className="text-right">
            <span
              className="block text-3xl font-bold text-foreground transition-all"
              aria-live="polite"
            >
              {convertPrice(amount, currencyInfo)}
            </span>
            {showLocalCurrency && (
              <span className="mt-0.5 block text-xs text-muted-foreground">
                Se cobrará {fmtCop(amount)}
              </span>
            )}
          </div>
        </div>

        {showLocalCurrency && (
          <p className="mt-3 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            Precio estimado en {currencyInfo.code}. El cargo final se procesa en pesos
            colombianos (COP); tu banco aplicará la tasa de cambio vigente.
          </p>
        )}

        <div className="mt-auto pt-8">
          {/*
            Contenedor del formulario de Wompi. Siempre está en el DOM para que
            el click programático al botón de Wompi funcione correctamente.
            Está cubierto visualmente por nuestro botón mientras el form no existe.
          */}
          {/* Fuera del viewport: visible para el DOM (permite click programático) pero no para el usuario */}
          <div
            ref={wompiFormRef}
            aria-hidden="true"
            style={{ position: 'fixed', top: '-9999px', left: '-9999px' }}
          />

          <Button
            className="w-full"
            size="lg"
            onClick={handlePay}
            disabled={paying}
            aria-label="Pagar con Wompi"
          >
            {paying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                Preparando pago…
              </>
            ) : (
              'Pagar con Wompi'
            )}
          </Button>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            Pago seguro procesado por Wompi
          </p>
        </div>
      </section>
    </div>
  );
}
