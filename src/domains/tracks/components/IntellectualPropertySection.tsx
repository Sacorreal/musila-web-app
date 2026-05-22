"use client";

import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import {
  Plus,
  X,
  FileText,
  ShieldCheck,
  Building2,
  Globe,
  Users,
} from "lucide-react";

import { Button } from "@shared/components/UI/button";
import { Switch } from "@shared/components/UI/switch";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@shared/components/UI/field";

import type { CreateTrackFormValues } from "@domains/tracks/validations/track.schema";
import {
  copyrightOfficeOptions,
  cmoOptions,
} from "@domains/tracks/data/intellectual-property.data";

import { useState, useRef } from "react";

// ─────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────

export function IntellectualPropertySection() {
  const [isEnabled, setIsEnabled] = useState(false);

  const { control, setValue, watch } =
    useFormContext<CreateTrackFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "intellectualProperties",
  });

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    if (!checked) {
      // Limpiar todas las entradas cuando se desactiva
      const currentFields = fields.length;
      for (let i = currentFields - 1; i >= 0; i--) {
        remove(i);
      }
    }
  };

  const hasSplitSheet = fields.some((field) => field.type === "splitSheet");

  const addEntry = (type: "copyrightOffice" | "cmo" | "splitSheet") => {
    append({
      type,
      key: type === "splitSheet" ? "Split Sheet" : "",
      file: undefined as unknown as File,
    });
  };

  return (
    <section className="rounded-2xl border bg-card p-8 shadow-sm space-y-6">
      {/* Header con toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
            <ShieldCheck className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Propiedad intelectual</h2>
            <p className="text-sm text-muted-foreground">
              Registra los documentos de copyright y CMO (opcional)
            </p>
          </div>
        </div>
        <Switch checked={isEnabled} onCheckedChange={handleToggle} />
      </div>

      {/* Contenido expandible */}
      {isEnabled && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Lista de entradas */}
          {fields.length > 0 && (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <IntellectualPropertyRow
                  key={field.id}
                  index={index}
                  type={field.type}
                  onRemove={() => remove(index)}
                />
              ))}
            </div>
          )}

          {/* Botones para agregar */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl border-dashed hover:border-solid hover:bg-blue-500/5 hover:text-blue-600 hover:border-blue-300 transition-all"
              onClick={() => addEntry("copyrightOffice")}
            >
              <Globe className="h-4 w-4" />
              Agregar Copyright Office
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl border-dashed hover:border-solid hover:bg-violet-500/5 hover:text-violet-600 hover:border-violet-300 transition-all"
              onClick={() => addEntry("cmo")}
            >
              <Building2 className="h-4 w-4" />
              Agregar CMO
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={hasSplitSheet}
              className="gap-2 rounded-xl border-dashed hover:border-solid hover:bg-emerald-500/5 hover:text-emerald-600 hover:border-emerald-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => addEntry("splitSheet")}
            >
              <Users className="h-4 w-4" />
              Agregar Split Sheet
            </Button>
          </div>

          {/* Info */}
          {fields.length === 0 && (
            <div className="flex items-center gap-3 rounded-xl border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
              <ShieldCheck className="h-5 w-5 shrink-0 opacity-50" />
              <p>
                Agrega las entidades ante las cuales registraste tu obra.
                Puedes agregar múltiples Copyright Offices y CMOs.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// Fila individual (Copyright Office o CMO)
// ─────────────────────────────────────────────────────────

interface RowProps {
  index: number;
  type: "copyrightOffice" | "cmo" | "splitSheet";
  onRemove: () => void;
}

function IntellectualPropertyRow({ index, type, onRemove }: RowProps) {
  const { control, setValue, watch } =
    useFormContext<CreateTrackFormValues>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentFile = watch(`intellectualProperties.${index}.file`);
  const isCopyrightOffice = type === "copyrightOffice";
  const isSplitSheet = type === "splitSheet";

  const badgeColor = isCopyrightOffice
    ? "bg-blue-500/10 text-blue-600 border-blue-200"
    : isSplitSheet
    ? "bg-emerald-500/10 text-emerald-600 border-emerald-200"
    : "bg-violet-500/10 text-violet-600 border-violet-200";

  const badgeIcon = isCopyrightOffice ? (
    <Globe className="h-3.5 w-3.5" />
  ) : isSplitSheet ? (
    <Users className="h-3.5 w-3.5" />
  ) : (
    <Building2 className="h-3.5 w-3.5" />
  );

  const badgeLabel = isCopyrightOffice ? "Copyright Office" : isSplitSheet ? "Split Sheet" : "CMO";

  return (
    <div className="group relative rounded-xl border bg-muted/20 p-5 space-y-4 transition-colors hover:bg-muted/30">
      {/* Header: badge + eliminar */}
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${badgeColor}`}
        >
          {badgeIcon}
          {badgeLabel}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
          aria-label="Eliminar registro"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Selector */}
      {!isSplitSheet && (
        <Controller
          name={`intellectualProperties.${index}.key`}
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                {isCopyrightOffice
                  ? "País / Copyright Office"
                  : "Sociedad de Gestión Colectiva (CMO)"}
              </FieldLabel>
              <select
                {...field}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">
                  {isCopyrightOffice
                    ? "Seleccionar país..."
                    : "Seleccionar CMO..."}
                </option>
                {isCopyrightOffice
                  ? copyrightOfficeOptions.map((opt) => (
                      <option key={opt.countryCode} value={opt.countryCode}>
                        {opt.countryName} — {opt.officeName}
                      </option>
                    ))
                  : cmoOptions.map((opt) => (
                      <option key={opt.acronym} value={opt.acronym}>
                        {opt.acronym} — {opt.originalName}
                      </option>
                    ))}
              </select>
              {fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      )}

      {/* File input */}
      <Controller
        name={`intellectualProperties.${index}.file`}
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Documento PDF</FieldLabel>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`
                  flex flex-1 items-center gap-3 rounded-lg border-2 border-dashed px-4 py-3 text-sm transition-colors
                  ${
                    currentFile
                      ? "border-emerald-300 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
                      : "border-input bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:border-primary/30"
                  }
                `}
              >
                <FileText
                  className={`h-5 w-5 shrink-0 ${
                    currentFile ? "text-emerald-500" : "opacity-50"
                  }`}
                />
                <span className="truncate">
                  {currentFile
                    ? currentFile.name
                    : "Seleccionar archivo PDF..."}
                </span>
              </button>

              {currentFile && (
                <button
                  type="button"
                  onClick={() => {
                    field.onChange(undefined);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                  aria-label="Quitar archivo"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  field.onChange(file);
                }
              }}
            />

            <p className="text-xs text-muted-foreground mt-1">
              Solo archivos PDF
            </p>

            {fieldState.error && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
    </div>
  );
}
