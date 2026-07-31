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
import type { AdminMoodDto } from '@/src/domains/admin/types/admin.types'

const schema = z.object({
  name: z.string().min(1, 'El nombre del mood es obligatorio'),
  slug: z.string().optional(),
  category: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  isOpen: boolean
  onClose: () => void
  initialData?: AdminMoodDto | null
}

export function MoodFormDialog({ isOpen, onClose, initialData }: Props) {
  const isEdit = !!initialData
  const { mutateAsync: createMood, isPending: isCreating } = adminHooks.useCreateMood()
  const { mutateAsync: updateMood, isPending: isUpdating } = adminHooks.useUpdateMood()
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
        name: initialData?.name ?? '',
        slug: initialData?.slug ?? '',
        category: initialData?.category ?? '',
      })
    }
  }, [isOpen, initialData, reset])

  const onSubmit = async (data: FormValues) => {
    if (isEdit && initialData) {
      await updateMood({ id: initialData.id, input: data })
    } else {
      await createMood(data)
    }
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { reset(); onClose() } }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Mood' : 'Nuevo Mood'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifica los datos del mood.' : 'Agrega un nuevo mood al catálogo.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Field data-invalid={!!errors.name}>
            <FieldLabel>Nombre del mood</FieldLabel>
            <Input placeholder="Ej: Alegre, Nostálgica..." {...register('name')} />
            {errors.name && <FieldError errors={[errors.name]} />}
          </Field>

          <Field>
            <FieldLabel>Slug (opcional)</FieldLabel>
            <Input placeholder="ej: alegre" {...register('slug')} />
          </Field>

          <Field>
            <FieldLabel>Categoría (opcional)</FieldLabel>
            <Input placeholder="Ej: Emociones positivas" {...register('category')} />
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
                'Crear Mood'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
