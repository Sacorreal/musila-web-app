"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Input } from "@/src/shared/components/UI/input";
import { Label } from "@/src/shared/components/UI/label";
import { Button } from "@/src/shared/components/UI/button";
import { Field, FieldError } from "@/src/shared/components/UI/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/UI/select";
import { CountryCodeSelect } from "@/src/domains/auth/components/CountryCodeSelect";
import {
  legalIdentitySchema,
  type LegalIdentityFormValues,
} from "../schema/legal-identity.schema";
import { LEGAL_IDENTIFICATION_TYPE_LABELS, LegalIdentificationType } from "../types/legal-identity.types";
import { useLegalIdentity, useUpdateLegalIdentity } from "../hooks/legal-identity.hooks";

export function LegalIdentityForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const { data: legalIdentity, isLoading } = useLegalIdentity();
  const { mutate: updateLegalIdentity, isPending } = useUpdateLegalIdentity();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<LegalIdentityFormValues>({
    resolver: zodResolver(legalIdentitySchema),
    mode: "onChange",
    defaultValues: {
      primerNombre: "",
      segundoNombre: "",
      primerApellido: "",
      segundoApellido: "",
      tipoIdentificacion: LegalIdentificationType.CC,
      numeroIdentificacion: "",
      fechaExpedicion: "",
      numeroCelular: "",
      indicativoPais: "+57",
    },
  });

  useEffect(() => {
    if (legalIdentity) {
      reset({
        primerNombre: legalIdentity.primerNombre,
        segundoNombre: legalIdentity.segundoNombre,
        primerApellido: legalIdentity.primerApellido,
        segundoApellido: legalIdentity.segundoApellido,
        tipoIdentificacion: legalIdentity.tipoIdentificacion,
        numeroIdentificacion: legalIdentity.numeroIdentificacion,
        fechaExpedicion: legalIdentity.fechaExpedicion,
        numeroCelular: legalIdentity.numeroCelular,
        indicativoPais: legalIdentity.indicativoPais,
      });
    }
  }, [legalIdentity, reset]);

  const onSubmit = (values: LegalIdentityFormValues) => {
    updateLegalIdentity(values, {
      onSuccess: () => {
        if (redirectTo) router.push(redirectTo);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tighter italic">Identidad Legal</h3>
          <p className="text-sm text-muted-foreground">
            Requerida para firmar splits y reproducir canciones de otros autores (Ley 527).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field data-invalid={!!errors.primerNombre}>
          <Label>Primer nombre</Label>
          <Input {...register("primerNombre")} disabled={isLoading} aria-invalid={!!errors.primerNombre} />
          {errors.primerNombre && <FieldError errors={[errors.primerNombre]} />}
        </Field>

        <Field data-invalid={!!errors.segundoNombre}>
          <Label>Segundo nombre</Label>
          <Input {...register("segundoNombre")} disabled={isLoading} aria-invalid={!!errors.segundoNombre} />
          {errors.segundoNombre && <FieldError errors={[errors.segundoNombre]} />}
        </Field>

        <Field data-invalid={!!errors.primerApellido}>
          <Label>Primer apellido</Label>
          <Input {...register("primerApellido")} disabled={isLoading} aria-invalid={!!errors.primerApellido} />
          {errors.primerApellido && <FieldError errors={[errors.primerApellido]} />}
        </Field>

        <Field data-invalid={!!errors.segundoApellido}>
          <Label>Segundo apellido</Label>
          <Input {...register("segundoApellido")} disabled={isLoading} aria-invalid={!!errors.segundoApellido} />
          {errors.segundoApellido && <FieldError errors={[errors.segundoApellido]} />}
        </Field>

        <Field data-invalid={!!errors.tipoIdentificacion}>
          <Label>Tipo de identificación</Label>
          <Controller
            name="tipoIdentificacion"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(LegalIdentificationType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {LEGAL_IDENTIFICATION_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.tipoIdentificacion && <FieldError errors={[errors.tipoIdentificacion]} />}
        </Field>

        <Field data-invalid={!!errors.numeroIdentificacion}>
          <Label>Número de identificación</Label>
          <Input {...register("numeroIdentificacion")} disabled={isLoading} aria-invalid={!!errors.numeroIdentificacion} />
          {errors.numeroIdentificacion && <FieldError errors={[errors.numeroIdentificacion]} />}
        </Field>

        <Field data-invalid={!!errors.fechaExpedicion}>
          <Label>Fecha de expedición</Label>
          <Input type="date" {...register("fechaExpedicion")} disabled={isLoading} aria-invalid={!!errors.fechaExpedicion} />
          {errors.fechaExpedicion && <FieldError errors={[errors.fechaExpedicion]} />}
        </Field>

        <Field data-invalid={!!errors.indicativoPais}>
          <Label>Indicativo de país</Label>
          <Controller
            name="indicativoPais"
            control={control}
            render={({ field }) => (
              <CountryCodeSelect value={field.value} onValueChange={field.onChange} />
            )}
          />
          {errors.indicativoPais && <FieldError errors={[errors.indicativoPais]} />}
        </Field>

        <Field data-invalid={!!errors.numeroCelular}>
          <Label>Número de celular</Label>
          <Input {...register("numeroCelular")} disabled={isLoading} aria-invalid={!!errors.numeroCelular} />
          {errors.numeroCelular && <FieldError errors={[errors.numeroCelular]} />}
        </Field>
      </div>

      <Button type="submit" disabled={isPending || isLoading || !isDirty} className="w-full sm:w-auto">
        {isPending ? "Guardando..." : "Guardar y verificar identidad"}
      </Button>
    </form>
  );
}
