"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";


import { CountryCodeSelect } from "./CountryCodeSelect";
import { SelectRoleUser } from "./SelectRoleUser";

import { Input } from "@/src/shared/components/UI/input";
import { Button } from "@shared/components/UI/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@shared/components/UI/field";

import {
  registerSchema,
  RegisterUsersFormValues,
} from "@domains/auth/validations/registerUserSchema";
import { useAuth } from "../../hooks/useAuth";

export function UserRegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { registerUser} = useAuth()

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    control,
  } = useForm<RegisterUsersFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      lastName: '',
      name: '',
      password: '',
      phone: '',
      repeatPassword: '',
      secondLastName: '',
      secondName: '',
      countryCode: "+57",
    },
  });

  const onSubmit = async (data: RegisterUsersFormValues) => {
    try {
      await registerUser(data);
      toast.success("Cuenta creada con éxito");
      reset();
      router.push("/music");
    } catch (error) {
      toast.error("Error al crear la cuenta", {
        description:
          error instanceof Error ? error.message : "Error inesperado",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        {/* Rol */}
        <Controller
          name="role"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <SelectRoleUser
                value={field.value}
                onValueChange={field.onChange}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Nombres */}
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Primer nombre</FieldLabel>
                <Input
                  {...field}
                  placeholder="Nombre"
                  autoComplete="given-name"
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Primer apellido</FieldLabel>
                <Input
                  {...field}
                  placeholder="Apellido"
                  autoComplete="family-name"
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        {/* Segundos nombres */}
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="secondName"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Segundo nombre</FieldLabel>
                <Input {...field} placeholder="Opcional" />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="secondLastName"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Segundo apellido</FieldLabel>
                <Input {...field} placeholder="Opcional" />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        {/* Teléfono */}
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="countryCode"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Indicativo</FieldLabel>
                <CountryCodeSelect
                  value={field.value}
                  onValueChange={field.onChange}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Celular</FieldLabel>
                <Input
                  {...field}
                  type="tel"
                  placeholder="3001234567"
                  autoComplete="tel"
                  inputMode="numeric"
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        {/* Email */}
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Email</FieldLabel>
              <Input
                {...field}
                type="email"
                placeholder="tu@email.com"
                autoComplete="email"
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Contraseña</FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Repeat Password */}
        <Controller
          name="repeatPassword"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Repetir contraseña</FieldLabel>
              <Input
                {...field}
                type={showPassword ? "text" : "password"}
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creando cuenta...
          </>
        ) : (
          "Crear cuenta"
        )}
      </Button>
    </form>
  );
}
