"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/src/shared/components/UI/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/src/shared/components/UI/input-group";
import { useUsernameAvailability } from "../hooks/users.hooks";

interface UsernameFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  label?: string;
  /** Username actual del usuario (edición de perfil): no se marca como "no disponible". */
  currentUsername?: string;
}

/** Campo reutilizable de username (@Nombre123) con feedback de disponibilidad en tiempo real. */
export function UsernameField({
  value,
  onChange,
  onBlur,
  error,
  disabled,
  label = "Nombre de usuario",
  currentUsername,
}: UsernameFieldProps) {
  const { isChecking, isAvailable, isFormatValid } = useUsernameAvailability(value, currentUsername);

  const showAvailability = !error && isFormatValid && value.trim().length > 0;

  return (
    <Field data-invalid={!!error}>
      <FieldLabel>{label}</FieldLabel>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>@</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/^@/, ""))}
          onBlur={onBlur}
          disabled={disabled}
          placeholder="Nombre123"
          autoCapitalize="off"
          autoCorrect="off"
          aria-invalid={!!error}
        />
        {showAvailability && (
          <InputGroupAddon align="inline-end">
            {isChecking ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : isAvailable === true ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-label="Disponible" />
            ) : isAvailable === false ? (
              <XCircle className="h-4 w-4 text-destructive" aria-label="No disponible" />
            ) : null}
          </InputGroupAddon>
        )}
      </InputGroup>
      {error ? (
        <FieldError>{error}</FieldError>
      ) : showAvailability && !isChecking && isAvailable === false ? (
        <p className="text-destructive text-sm font-normal">Ese nombre de usuario ya está en uso</p>
      ) : null}
    </Field>
  );
}
