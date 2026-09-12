'use client';

import { useState } from 'react';
import { BankAccountForm } from '@/src/domains/wallet/components/BankAccountForm';
import { ForeignBankInformationForm } from '@/src/domains/bank-information/components/ForeignBankInformationForm';
import { RadioGroup, RadioGroupItem } from '@/src/shared/components/UI/radio-group';
import { FieldLabel } from '@/src/shared/components/UI/field';
import { BankInformationMethodOption } from '@/src/domains/bank-information/bank-information.schema';

export function BankAccountTab() {
  const [method, setMethod] = useState<BankInformationMethodOption>('colombia');

  return (
    <section className="rounded-xl border bg-card p-6 space-y-6">
      <RadioGroup
        value={method}
        onValueChange={(value) => setMethod(value as BankInformationMethodOption)}
        className="grid grid-cols-2 gap-3"
      >
        <FieldLabel htmlFor="bank-method-colombia">
          <RadioGroupItem id="bank-method-colombia" value="colombia" />
          Colombia
        </FieldLabel>
        <FieldLabel htmlFor="bank-method-foreign">
          <RadioGroupItem id="bank-method-foreign" value="foreign" />
          Extranjero (Global66)
        </FieldLabel>
      </RadioGroup>

      {method === 'colombia' ? (
        <BankAccountForm />
      ) : (
        <ForeignBankInformationForm onSuccess={() => {}} />
      )}
    </section>
  );
}
