"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Landmark } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";
import { Field, FieldError, FieldLabel } from "@/src/shared/components/UI/field";
import { Input } from "@/src/shared/components/UI/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/components/UI/select";
import { bankAccountSchema, BankAccountFormValues } from "../wallet.schema";
import { useBankAccount, useUpdateBankAccount } from "../hooks/wallet.hooks";
import { useTransferOptions } from "@/src/domains/bank-information/hooks/bank-information.hooks";
import { StepUpAuthModal } from "@domains/security/components/StepUpAuthModal";

const BANK_ACCOUNT_STEP_UP_SCOPE = "account.bank_account.update";

export function BankAccountForm() {
  const { data: bankAccount, isLoading } = useBankAccount();
  const { data: options, isLoading: isLoadingOptions, isError, refetch } = useTransferOptions(true);
  const { mutate: updateBankAccount, isPending } = useUpdateBankAccount();
  const [stepUpOpen, setStepUpOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<BankAccountFormValues | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<BankAccountFormValues>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      bankCode: "",
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
    setPendingValues(values);
    setStepUpOpen(true);
  };

  if (isLoading || isLoadingOptions) {
    return <div className="h-64 animate-pulse rounded-xl bg-muted/40" />;
  }

  if (isError || !options) {
    return (
      <div className="space-y-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        <p>No pudimos obtener la lista de bancos de Wompi. Intenta nuevamente.</p>
        <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    );
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
        <Controller
          name="bankCode"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Banco</FieldLabel>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  const bank = options.banks.find((b) => b.id === value);
                  setValue("bankName", bank?.name ?? "", { shouldDirty: true });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona tu banco" />
                </SelectTrigger>
                <SelectContent>
                  {options.banks.map((bank) => (
                    <SelectItem key={bank.id} value={bank.id}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[errors.bankCode]} />
            </Field>
          )}
        />
        <input type="hidden" {...register("bankName")} />

        <Controller
          name="accountType"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Tipo de cuenta</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona el tipo de cuenta" />
                </SelectTrigger>
                <SelectContent>
                  {options.accountTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[errors.accountType]} />
            </Field>
          )}
        />

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

        <Controller
          name="accountHolderIdType"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Tipo de documento</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona el tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  {options.documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[errors.accountHolderIdType]} />
            </Field>
          )}
        />

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

      <StepUpAuthModal
        open={stepUpOpen}
        onOpenChange={setStepUpOpen}
        scope={BANK_ACCOUNT_STEP_UP_SCOPE}
        onVerified={() => {
          setStepUpOpen(false);
          if (pendingValues) {
            updateBankAccount(pendingValues, { onSuccess: () => reset(pendingValues) });
          }
        }}
      />
    </form>
  );
}
