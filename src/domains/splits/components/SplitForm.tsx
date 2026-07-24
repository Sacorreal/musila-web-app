"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, Users, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";
import { Switch } from "@/src/shared/components/UI/switch";
import { Field, FieldError, FieldLabel } from "@/src/shared/components/UI/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/src/shared/components/UI/input-group";
import { cn } from "@/src/shared/libs/cn";
import { CoauthorSearchInput } from "./CoauthorSearchInput";
import { createSplitSchema, CreateSplitFormValues, distributeEqualPercentages } from "../schema/splits.schema";
import { useCreateSplit, useUpdateSplit } from "../hooks/splits.hooks";
import { COAUTHOR_ROLE_LABELS, CoauthorRole, SplitResponse } from "../types/splits.types";

interface Props {
  trackId: string;
  /** Presente en modo edición de un split bloqueado (rechazado). */
  existingSplit?: SplitResponse;
  onDone: () => void;
}

export function SplitForm({ trackId, existingSplit, onDone }: Props) {
  const [equalSplit, setEqualSplit] = useState(false);

  const { control, handleSubmit, watch, setValue, formState: { errors, isValid } } =
    useForm<CreateSplitFormValues>({
      resolver: zodResolver(createSplitSchema),
      mode: "onChange",
      defaultValues: {
        authors: existingSplit
          ? existingSplit.authors.map((a) => ({
              userId: a.user.id,
              musilaCreatorId: a.user.musilaCreatorId,
              name: `${a.user.name} ${a.user.lastName}`,
              percentage: Number(a.percentage),
              role: a.role,
            }))
          : [],
      },
    });

  const { fields, append, remove } = useFieldArray({ control, name: "authors" });
  const authors = watch("authors");

  const { mutate: createSplit, isPending: isCreating } = useCreateSplit(trackId);
  const { mutate: updateSplit, isPending: isUpdating } = useUpdateSplit(trackId);
  const isSaving = isCreating || isUpdating;

  const sum = authors.reduce((acc, a) => acc + (Number(a.percentage) || 0), 0);
  const sumRounded = Math.round(sum * 100) / 100;
  const sumIsValid = sumRounded === 100;

  useEffect(() => {
    if (!equalSplit || fields.length === 0) return;
    const percentages = distributeEqualPercentages(fields.length);
    percentages.forEach((p, i) => setValue(`authors.${i}.percentage`, p, { shouldValidate: true }));
    // Solo recalcular cuando cambia la cantidad de coautores mientras el switch está activo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equalSplit, fields.length]);

  const onSubmit = (values: CreateSplitFormValues) => {
    const payload = {
      authors: values.authors.map((a) => ({ userId: a.userId, percentage: a.percentage, role: a.role })),
    };

    if (existingSplit) {
      updateSplit({ splitId: existingSplit.id, data: payload }, { onSuccess: onDone });
    } else {
      createSplit(payload, { onSuccess: onDone });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <CoauthorSearchInput
        disabled={isSaving}
        onSelect={(user) => {
          if (fields.some((f) => f.userId === user.id)) return;
          append({
            userId: user.id,
            musilaCreatorId: user.musilaCreatorId,
            name: `${user.name} ${user.lastName}`,
            percentage: 0,
            role: CoauthorRole.COMPOSITOR,
          });
        }}
      />

      <div className="flex items-center justify-between rounded-xl border bg-muted/20 p-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Dividir en partes iguales</p>
          <p className="text-xs text-muted-foreground">Reparte 100% entre los coautores agregados</p>
        </div>
        <Switch checked={equalSplit} onCheckedChange={setEqualSplit} disabled={isSaving} />
      </div>

      {fields.length > 0 && (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-3 rounded-xl border bg-muted/10 p-4 sm:flex-row sm:items-end">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Coautor</p>
                <p className="truncate font-semibold text-foreground">{field.name}</p>
                <p className="text-xs text-muted-foreground">{field.musilaCreatorId}</p>
              </div>

              <Controller
                name={`authors.${index}.percentage`}
                control={control}
                render={({ field: f, fieldState }) => (
                  <Field className="w-full sm:w-32">
                    <FieldLabel>Porcentaje</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        type="number"
                        step="0.01"
                        min={0}
                        max={100}
                        disabled={equalSplit || isSaving}
                        value={f.value ?? ""}
                        onChange={(e) => f.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupText>%</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name={`authors.${index}.role`}
                control={control}
                render={({ field: f, fieldState }) => (
                  <Field className="w-full sm:w-48">
                    <FieldLabel>Rol</FieldLabel>
                    <select
                      {...f}
                      disabled={isSaving}
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {Object.values(CoauthorRole).map((role) => (
                        <option key={role} value={role}>
                          {COAUTHOR_ROLE_LABELS[role]}
                        </option>
                      ))}
                    </select>
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <button
                type="button"
                onClick={() => remove(index)}
                disabled={isSaving}
                className="flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all disabled:opacity-40"
                aria-label="Eliminar coautor"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {errors.authors?.message && <FieldError>{errors.authors.message}</FieldError>}

      {fields.length > 0 && (
        <div
          className={cn(
            "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold",
            sumIsValid
              ? "border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30"
              : "border-red-200 bg-red-500/10 text-red-700 dark:border-red-500/30",
          )}
        >
          {sumIsValid ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          Suma de porcentajes: {sumRounded}%
        </div>
      )}

      {fields.length === 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
          <Users className="h-5 w-5 shrink-0 opacity-50" />
          Busca coautores por su Musila Creator ID para agregarlos al split.
        </div>
      )}

      <Button type="submit" disabled={!isValid || isSaving || fields.length === 0} className="w-full gap-2">
        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        {existingSplit ? "Guardar cambios y reenviar aprobación" : "Crear split"}
      </Button>
    </form>
  );
}
