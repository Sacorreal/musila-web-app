import React from 'react';
import Link from 'next/link';
import { MusilaLogo } from '@/src/shared/components/Icons/icons';
import { CheckoutCart } from '@/src/domains/payments/components/checkout-cart';
import { InvalidPlanNotice } from '@/src/domains/payments/components/InvalidPlanNotice';
import type { WompiPaymentRole } from '@/src/domains/payments/wompi.schema';
import type { CurrencyInfo } from '@/src/domains/payments/currency.actions';

interface CheckoutPageContentProps {
  role: WompiPaymentRole | null;
  defaultAnnual: boolean;
  currencyInfo: CurrencyInfo;
}

export function CheckoutPageContent({ role, defaultAnnual, currencyInfo }: CheckoutPageContentProps) {
  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <Link href="/" className="mb-8 inline-flex">
          <MusilaLogo className="h-9 w-auto text-primary" />
        </Link>
        <h1 className="mb-1 text-2xl font-bold text-foreground sm:text-3xl">
          Confirma tu suscripción
        </h1>
        <p className="mb-8 text-muted-foreground">
          Revisa el detalle de tu plan y completa el pago de forma segura.
        </p>

        {role ? (
          <CheckoutCart role={role} defaultAnnual={defaultAnnual} currencyInfo={currencyInfo} />
        ) : (
          <InvalidPlanNotice />
        )}
      </div>
    </div>
  );
}
