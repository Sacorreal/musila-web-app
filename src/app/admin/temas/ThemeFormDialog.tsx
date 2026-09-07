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
import type { AdminThemeDto } from '@/src/domains/admin/types/admin.types'

const schema = z.object({
  name: z.string().min(1, 'El nombre del tema es obligatorio'),
  slug: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  isOpen: boolean
  onClose: () => void
  initialData?: AdminThemeDto | null
}

export function ThemeFormDialog({ isOpen, onClose, initialData }: Props) {
  const isEdit = !!initialData
  const { mutateAsync: createTheme, isPending: isCreating } = adminHooks.useCreateTheme()
  const { mutateAsync: updateTheme, isPending: isUpdating } = adminHooks.useUpdateTheme()
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
      })
    }
  }, [isOpen, initialData, reset])

  const onSubmit = async (data: FormValues) => {
    if (isEdit && initialData) {
      await updateTheme({ id: initialData.id, input: data })
    } else {
      await createTheme(data)
    }
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { reset(); onClose() } }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Tema' : 'Nuevo Tema'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifica los datos del tema.' : 'Agrega un nuevo tema/uso al catálogo.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Field data-invalid={!!errors.name}>
            <FieldLabel>Nombre del tema</FieldLabel>
            <Input placeholder="Ej: Navidad, Familia..." {...register('name')} />
            {errors.name && <FieldError errors={[errors.name]} />}
          </Field>

          <Field>
            <FieldLabel>Slug (opcional)</FieldLabel>
            <Input placeholder="ej: navidad" {...register('slug')} />
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
                'Crear Tema'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
