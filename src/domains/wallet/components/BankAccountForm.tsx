"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Landmark } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";
import { Field, FieldError, FieldLabel } from "@/src/shared/components/UI/field";
import { Input } from "@/src/shared/components/UI/input";
import { bankAccountSchema, BankAccountFormValues } from "../wallet.schema";
import { useBankAccount, useUpdateBankAccount } from "../hooks/wallet.hooks";

export function BankAccountForm() {
  const { data: bankAccount, isLoading } = useBankAccount();
  const { mutate: updateBankAccount, isPending } = useUpdateBankAccount();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<BankAccountFormValues>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      bankName: "",
      accountType: "",
      accountNumber: "",
      accountHolderName: "",
      accountHolderIdType: "",
      accountHolderIdNumber: "",
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
        <h3 className="text-sm font-semibold text-foreground">Datos bancarios para retiros</h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Esta información se usará para procesar tus solicitudes de retiro de saldo del Wallet.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="bankName">Banco</FieldLabel>
          <Input id="bankName" placeholder="Bancolombia" {...register("bankName")} />
          <FieldError errors={[errors.bankName]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="accountType">Tipo de cuenta</FieldLabel>
          <Input id="accountType" placeholder="Ahorros" {...register("accountType")} />
          <FieldError errors={[errors.accountType]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="accountNumber">Número de cuenta</FieldLabel>
          <Input id="accountNumber" placeholder="00000000000" {...register("accountNumber")} />
          <FieldError errors={[errors.accountNumber]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="accountHolderName">Titular de la cuenta</FieldLabel>
          <Input id="accountHolderName" placeholder="Nombre completo" {...register("accountHolderName")} />
          <FieldError errors={[errors.accountHolderName]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="accountHolderIdType">Tipo de documento</FieldLabel>
          <Input id="accountHolderIdType" placeholder="CC" {...register("accountHolderIdType")} />
          <FieldError errors={[errors.accountHolderIdType]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="accountHolderIdNumber">Número de documento</FieldLabel>
          <Input id="accountHolderIdNumber" placeholder="1234567890" {...register("accountHolderIdNumber")} />
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
