'use client'

import { User } from 'lucide-react'
import { Field, FieldLabel } from '@shared/components/UI/field'

interface Props {
  value: File | null | undefined
  onChange: (file: File | null) => void
  existingUrl?: string | null
}

export function AvatarUploadField({ value, onChange, existingUrl }: Props) {
  const preview = value instanceof File ? URL.createObjectURL(value) : existingUrl

  return (
    <Field>
      <FieldLabel>Foto de perfil (opcional)</FieldLabel>
      <div className="mt-2 flex items-center gap-6">
        <label
          htmlFor="admin-author-avatar-upload"
          className="group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed bg-muted/50 transition-colors hover:bg-muted"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Avatar preview" className="h-full w-full object-cover" />
          ) : (
            <User className="h-8 w-8 text-muted-foreground opacity-50" />
          )}
          <input
            id="admin-author-avatar-upload"
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
