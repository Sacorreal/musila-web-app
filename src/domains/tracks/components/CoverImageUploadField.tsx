"use client"

import { Image as ImageIcon } from "lucide-react"
import { Field, FieldLabel } from "@shared/components/UI/field"

interface Props {
  value: File | null | undefined
  onChange: (file: File | null) => void
}

export function CoverImageUploadField({ value, onChange }: Props) {
  const preview = value instanceof File ? URL.createObjectURL(value) : null

  return (
    <Field>
      <FieldLabel>Portada (opcional)</FieldLabel>
      <div className="flex items-center gap-6 mt-2">
        <label
          htmlFor="admin-cover-upload"
          className="relative flex w-32 h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/50 hover:bg-muted transition-colors overflow-hidden group"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Cover preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-xs font-medium">Subir imagen</span>
            </div>
          )}
          <input
            id="admin-cover-upload"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          />
        </label>
        <p className="text-xs text-muted-foreground">Formatos: JPG, PNG. Máx 5MB.</p>
      </div>
    </Field>
  )
}
