'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { adminHooks } from '@/src/domains/admin/hooks/admin.hooks'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Field, FieldLabel, FieldError } from '@/src/shared/components/UI/field'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/src/shared/components/UI/dialog'
import type { AdminGenreDto } from '@/src/domains/admin/types/admin.types'

const schema = z.object({
  genre: z.string().min(1, 'El nombre del género es obligatorio'),
  slug: z.string().optional(),
  subGenreRaw: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  isOpen: boolean
  onClose: () => void
  initialData?: AdminGenreDto | null
}

export function GenreFormDialog({ isOpen, onClose, initialData }: Props) {
  const isEdit = !!initialData
  const { mutateAsync: createGenre, isPending: isCreating } = adminHooks.useCreateGenre()
  const { mutateAsync: updateGenre, isPending: isUpdating } = adminHooks.useUpdateGenre()
  const isPending = isCreating || isUpdating

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (isOpen) {
      reset({
        genre: initialData?.genre ?? '',
        slug: initialData?.slug ?? '',
        subGenreRaw: initialData?.subGenre?.join(', ') ?? '',
      })
    }
  }, [isOpen, initialData, reset])

  const onSubmit = async (data: FormValues) => {
    const subGenre = data.subGenreRaw
      ? data.subGenreRaw.split(',').map((s) => s.trim()).filter(Boolean)
      : []

    if (isEdit && initialData) {
      await updateGenre({ id: initialData.id, input: { genre: data.genre, slug: data.slug, subGenre } })
    } else {
      await createGenre({ genre: data.genre, slug: data.slug, subGenre })
    }
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { reset(); onClose() } }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Género' : 'Nuevo Género Musical'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifica los datos del género.' : 'Agrega un nuevo género al catálogo.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Field data-invalid={!!errors.genre}>
            <FieldLabel>Nombre del género</FieldLabel>
            <Input placeholder="Ej: Rock, Salsa, Jazz..." {...register('genre')} />
            {errors.genre && <FieldError errors={[errors.genre]} />}
          </Field>

          <Field>
            <FieldLabel>Slug (opcional)</FieldLabel>
            <Input placeholder="ej: rock-alternativo" {...register('slug')} />
          </Field>

          <Field>
            <FieldLabel>Subgéneros (separados por coma)</FieldLabel>
            <Input placeholder="Ej: Rock Clásico, Rock Alternativo" {...register('subGenreRaw')} />
          </Field>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => { reset(); onClose() }} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : isEdit ? (
                'Guardar Cambios'
              ) : (
                'Crear Género'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
