"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { CountryCodeSelect } from "./CountryCodeSelect";

import { Input } from "@/src/shared/components/UI/input";
import {
  registerSchema,
  RegisterUsersFormValues,
} from "@domains/auth/validations/registerUserSchema";
import { Button } from "@shared/components/UI/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@shared/components/UI/field";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { SelectRoleUser } from "./SelectRoleUser";

export function UserRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<RegisterUsersFormValues>({
    resolver: zodResolver(registerSchema),
  });

  function onSubmit(data: RegisterUsersFormValues) {}

  return (
    <>
      <form id="form-register-user" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="rol"
            control={control}
            render={({ fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <SelectRoleUser />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="name"
              control={control}
              render={({ fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="form-register-user-name">
                      Primer nombre
                    </FieldLabel>

                    <Input
                      type="text"
                      placeholder="nombre"
                      required
                      disabled={isSubmitting}
                      className="bg-card"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                </Field>
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="form-register-user-lastname">
                      Primer apellido
                    </FieldLabel>

                    <Input
                      type="text"
                      placeholder="apellido"
                      required
                      disabled={isSubmitting}
                      className="bg-card"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                </Field>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="secondName"
              control={control}
              render={({ fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="form-register-user-secondname">
                      Segundo nombre
                    </FieldLabel>

                    <Input
                      id="form-register-user-secondname"
                      type="text"
                      placeholder="opcional"
                      required
                      disabled={isSubmitting}
                      className="bg-card"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                </Field>
              )}
            />
            <Controller
              name="secondLastName"
              control={control}
              render={({ fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="form-register-user-secondLastName">
                      Segundo apellido
                    </FieldLabel>

                    <Input
                      id="form-register-user-secondLastName"
                      type="text"
                      placeholder="opcional"
                      required
                      disabled={isSubmitting}
                      className="bg-card"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                </Field>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="countryCode"
              control={control}
              render={({ fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="form-register-user-countryCode">
                      Indicativo del país
                    </FieldLabel>
                    <CountryCodeSelect />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                </Field>
              )}
            />
            <Controller
              name="phone"
              control={control}
              render={({ fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="space-y-2 col-span-2">
                    <FieldLabel htmlFor="celphone">Celular</FieldLabel>
                    <Input
                      id="celphone"
                      type="number"
                      disabled={isSubmitting}
                      className="bg-card"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                </Field>
              )}
            />
          </div>

          <Controller
            name="email"
            control={control}
            render={({ fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  disabled={isSubmitting}
                  className="bg-card"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="">
            <Controller
              name="password"
              control={control}
              render={({ fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      disabled={isSubmitting}
                      className="bg-card"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </Field>
              )}
            />
          </div>

          <div>
            <Controller
              name="repeatPassword"
              control={control}
              render={({ fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="repeatPassword">
                    Repetir contraseña
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      required
                      disabled={isSubmitting}
                      className="bg-card pr-10"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </Field>
              )}
            />
          </div>
        </FieldGroup>

        <Button type="submit" className="w-full mt-3" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando cuenta...
            </>
          ) : (
            "Crear cuenta"
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Al registrarte, aceptas nuestros{" "}
          <a href="/terms" className="text-primary hover:underline">
            Términos de servicio
          </a>{" "}
          y{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Política de privacidad
          </a>
        </p>
      </form>
    </>
  );
}
