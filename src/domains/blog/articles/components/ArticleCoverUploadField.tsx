'use client'

import { Image as ImageIcon } from 'lucide-react'
import { Field, FieldLabel } from '@shared/components/UI/field'

interface Props {
  value: File | null | undefined
  onChange: (file: File | null) => void
  existingUrl?: string | null
}

export function ArticleCoverUploadField({ value, onChange, existingUrl }: Props) {
  const preview = value instanceof File ? URL.createObjectURL(value) : existingUrl

  return (
    <Field>
      <FieldLabel>Imagen destacada (opcional)</FieldLabel>
      <label
        htmlFor="admin-article-cover-upload"
        className="group relative mt-2 flex h-48 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-muted/50 transition-colors hover:bg-muted"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Cover preview" className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <ImageIcon className="mb-2 h-8 w-8 opacity-50" />
            <span className="text-xs font-medium">Subir imagen destacada</span>
            <span className="mt-1 text-[11px] text-muted-foreground/70">Recomendado: se usará como og:image al compartir</span>
          </div>
        )}
        <input
          id="admin-article-cover-upload"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </label>
    </Field>
  )
}
