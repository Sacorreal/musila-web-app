'use client';

import { BankAccountForm } from '@/src/domains/wallet/components/BankAccountForm';

export function BankAccountTab() {
  return (
    <section className="rounded-xl border bg-card p-6">
      <h2 className="text-base font-semibold mb-4">Datos bancarios</h2>
      <BankAccountForm />
    </section>
  );
}
