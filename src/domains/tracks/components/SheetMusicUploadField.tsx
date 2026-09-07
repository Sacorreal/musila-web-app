"use client";

import { useRef } from "react";
import { FileText, X } from "lucide-react";

import { Field, FieldLabel } from "@shared/components/UI/field";

interface SheetMusicUploadFieldProps {
  value: File | null | undefined;
  onChange: (file: File | null) => void;
  error?: string;
}

export function SheetMusicUploadField({ value, onChange, error }: SheetMusicUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Field data-invalid={!!error}>
      <FieldLabel>Partitura (PDF)</FieldLabel>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`
            flex flex-1 items-center gap-3 rounded-lg border-2 border-dashed px-4 py-3 text-sm transition-colors
            ${
              value
                ? "border-emerald-300 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
                : "border-input bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:border-primary/30"
            }
          `}
        >
          <FileText
            className={`h-5 w-5 shrink-0 ${value ? "text-emerald-500" : "opacity-50"}`}
          />
          <span className="truncate">
            {value ? value.name : "Seleccionar archivo PDF..."}
          </span>
        </button>

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange(null);
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
          if (file) onChange(file);
        }}
      />

      <p className="text-xs text-muted-foreground mt-1">
        Solo archivos PDF (opcional)
      </p>

      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}
    </Field>
  );
}
