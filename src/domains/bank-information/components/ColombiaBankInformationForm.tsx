"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";
import { Field, FieldError, FieldLabel } from "@/src/shared/components/UI/field";
import { Input } from "@/src/shared/components/UI/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/components/UI/select";
import { colombiaBankInformationSchema, ColombiaBankInformationFormValues } from "../bank-information.schema";
import { useSaveColombiaBankInformation, useTransferOptions } from "../hooks/bank-information.hooks";

interface Props {
  requestId?: string;
  onSuccess: () => void;
}

export function ColombiaBankInformationForm({ requestId, onSuccess }: Props) {
  const { data: options, isLoading: isLoadingOptions, isError, refetch } = useTransferOptions(true);
  const { mutate: save, isPending } = useSaveColombiaBankInformation();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ColombiaBankInformationFormValues>({
    resolver: zodResolver(colombiaBankInformationSchema),
    defaultValues: {
      requestId,
      bankId: "",
      bankName: "",
      accountType: "",
      accountNumber: "",
      accountHolderName: "",
      accountHolderIdType: "",
      accountHolderIdNumber: "",
    },
  });

  const selectedBankId = watch("bankId");

  useEffect(() => {
    if (!requestId) return;
    setValue("requestId", requestId);
  }, [requestId, setValue]);

  const onSubmit = (values: ColombiaBankInformationFormValues) => {
    save(values, { onSuccess });
  };

  if (isLoadingOptions) {
    return <div className="h-64 animate-pulse rounded-xl bg-muted/40" />;
  }

  if (isError || !options) {
    return (
      <div className="space-y-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        <p>No pudimos obtener las opciones de transferencia de Wompi. Intenta nuevamente.</p>
        <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Controller
        name="bankId"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Banco</FieldLabel>
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                const bank = options.banks.find((b) => b.id === value);
                setValue("bankName", bank?.name ?? "");
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
            <FieldError errors={[errors.bankId]} />
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

      <Button type="submit" disabled={isPending || !selectedBankId} className="w-full gap-2">
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Guardar información bancaria
      </Button>
    </form>
  );
}
