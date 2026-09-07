"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";
import { Checkbox } from "@/src/shared/components/UI/checkbox";
import { Field, FieldError, FieldLabel } from "@/src/shared/components/UI/field";
import { Input } from "@/src/shared/components/UI/input";
import { foreignBankInformationSchema, ForeignBankInformationFormValues } from "../bank-information.schema";
import { useSaveForeignBankInformation } from "../hooks/bank-information.hooks";

interface Props {
  requestId?: string;
  onSuccess: () => void;
}

export function ForeignBankInformationForm({ requestId, onSuccess }: Props) {
  const { mutate: save, isPending } = useSaveForeignBankInformation();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ForeignBankInformationFormValues>({
    resolver: zodResolver(foreignBankInformationSchema),
    defaultValues: {
      requestId,
      countryCallingCode: "+57",
      phoneNumber: "",
      email: "",
      global66Username: "",
      acceptedLegalNotice: false,
    },
  });

  useEffect(() => {
    if (!requestId) return;
    setValue("requestId", requestId);
  }, [requestId, setValue]);

  const onSubmit = (values: ForeignBankInformationFormValues) => {
    save(values, { onSuccess });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field className="sm:col-span-1">
          <FieldLabel htmlFor="countryCallingCode">Indicativo</FieldLabel>
          <Input id="countryCallingCode" placeholder="+57" {...register("countryCallingCode")} />
          <FieldError errors={[errors.countryCallingCode]} />
        </Field>

        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="phoneNumber">Número de teléfono</FieldLabel>
          <Input id="phoneNumber" placeholder="3001234567" {...register("phoneNumber")} />
          <FieldError errors={[errors.phoneNumber]} />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="email">Correo de Global66</FieldLabel>
        <Input id="email" type="email" placeholder="tucorreo@ejemplo.com" {...register("email")} />
        <FieldError errors={[errors.email]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="global66Username">Nombre de usuario en Global66</FieldLabel>
        <Input id="global66Username" placeholder="@tunombre" {...register("global66Username")} />
        <FieldError errors={[errors.global66Username]} />
      </Field>

      <div className="flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-muted-foreground">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
        <ul className="list-disc space-y-1 pl-4">
          <li>Los pagos internacionales se procesan a través de Global66, un proveedor externo a Musila.</li>
          <li>Musila no se hace responsable por transferencias fallidas debido a información errónea o incompleta que hayas ingresado.</li>
          <li>El tiempo estimado de transferencia es de 24 horas hábiles.</li>
        </ul>
      </div>

      <Controller
        name="acceptedLegalNotice"
        control={control}
        render={({ field }) => (
          <Field orientation="horizontal">
            <Checkbox
              id="acceptedLegalNotice"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
            <FieldLabel htmlFor="acceptedLegalNotice" className="font-normal">
              He leído y acepto los avisos anteriores sobre pagos internacionales vía Global66.
            </FieldLabel>
            <FieldError errors={[errors.acceptedLegalNotice]} />
          </Field>
        )}
      />

      <Button type="submit" disabled={isPending} className="w-full gap-2">
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Guardar información bancaria
      </Button>
    </form>
  );
}
