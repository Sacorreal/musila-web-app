'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Landmark } from 'lucide-react';
import { Button } from '@/src/shared/components/UI/button';
import { Field, FieldError, FieldLabel } from '@/src/shared/components/UI/field';
import { Input } from '@/src/shared/components/UI/input';
import { bankAccountSchema, BankAccountFormValues } from '../wallet.schema';
import {
  usePublisherBankAccount,
  useUpdatePublisherBankAccount,
} from '../hooks/publisher-wallet.hooks';

export function PublisherBankAccountForm({ organizationId }: { organizationId: string }) {
  const { data: bankAccount, isLoading } = usePublisherBankAccount(organizationId);
  const { mutate: updateBankAccount, isPending } = useUpdatePublisherBankAccount(organizationId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<BankAccountFormValues>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      bankName: '',
      accountType: '',
      accountNumber: '',
      accountHolderName: '',
      accountHolderIdType: '',
      accountHolderIdNumber: '',
    },
  });

  useEffect(() => {
    if (bankAccount) reset(bankAccount);
  }, [bankAccount, reset]);

  const onSubmit = (values: BankAccountFormValues) => {
    updateBankAccount(values, { onSuccess: () => reset(values) });
  };

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-xl bg-muted/40" />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="flex items-center gap-2">
        <Landmark className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Datos bancarios de la organización</h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Se usarán para procesar los retiros de saldo de la wallet de la organización.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="bankName">Banco</FieldLabel>
          <Input id="bankName" placeholder="Bancolombia" {...register('bankName')} />
          <FieldError errors={[errors.bankName]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="accountType">Tipo de cuenta</FieldLabel>
          <Input id="accountType" placeholder="Ahorros" {...register('accountType')} />
          <FieldError errors={[errors.accountType]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="accountNumber">Número de cuenta</FieldLabel>
          <Input id="accountNumber" placeholder="00000000000" {...register('accountNumber')} />
          <FieldError errors={[errors.accountNumber]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="accountHolderName">Titular de la cuenta</FieldLabel>
          <Input id="accountHolderName" placeholder="Nombre / Razón social" {...register('accountHolderName')} />
          <FieldError errors={[errors.accountHolderName]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="accountHolderIdType">Tipo de documento</FieldLabel>
          <Input id="accountHolderIdType" placeholder="NIT" {...register('accountHolderIdType')} />
          <FieldError errors={[errors.accountHolderIdType]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="accountHolderIdNumber">Número de documento</FieldLabel>
          <Input id="accountHolderIdNumber" placeholder="900123456" {...register('accountHolderIdNumber')} />
          <FieldError errors={[errors.accountHolderIdNumber]} />
        </Field>
      </div>

      <Button type="submit" disabled={!isDirty || isPending} className="gap-2">
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Guardar datos bancarios
      </Button>
    </form>
  );
}
