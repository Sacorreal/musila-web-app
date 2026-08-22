'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { adminCmsHooks } from '@/src/domains/admin/collective-management-societies/admin-cms.hooks'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Field, FieldError, FieldLabel } from '@/src/shared/components/UI/field'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/src/shared/components/UI/dialog'
import type { AdminCollectiveManagementSocietyDto } from '@/src/domains/admin/collective-management-societies/admin-cms.types'

const schema = z.object({
  officialName: z.string().min(1, 'El nombre oficial es obligatorio'),
  acronym: z.string().min(1, 'La sigla es obligatoria'),
  country: z.string().min(1, 'El país es obligatorio'),
  isoCountryCode: z.string().length(2, 'Código ISO de 2 letras (ej. CO)').toUpperCase(),
  cisacSocietyId: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  isOpen: boolean
  onClose: () => void
  initialData?: AdminCollectiveManagementSocietyDto | null
}

export function CMSFormDialog({ isOpen, onClose, initialData }: Props) {
  const isEdit = !!initialData
  const { mutateAsync: createCms, isPending: isCreating } = adminCmsHooks.useCreateCollectiveManagementSociety()
  const { mutateAsync: updateCms, isPending: isUpdating } = adminCmsHooks.useUpdateCollectiveManagementSociety()
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
        officialName: initialData?.officialName ?? '',
        acronym: initialData?.acronym ?? '',
        country: initialData?.country ?? '',
        isoCountryCode: initialData?.isoCountryCode ?? '',
        cisacSocietyId: initialData?.cisacSocietyId ?? '',
      })
    }
  }, [isOpen, initialData, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (data: FormValues) => {
    const payload = { ...data, cisacSocietyId: data.cisacSocietyId || undefined }
    if (isEdit && initialData) {
      await updateCms({ id: initialData.id, input: payload })
    } else {
      await createCms(payload)
    }
    handleClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar sociedad' : 'Nueva sociedad de gestión colectiva'}</DialogTitle>
          <DialogDescription>Catálogo maestro controlado — estos datos alimentan el selector que usan los autores.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Field data-invalid={!!errors.acronym}>
            <FieldLabel>Sigla</FieldLabel>
            <Input placeholder="SAYCO" {...register('acronym')} />
            {errors.acronym && <FieldError errors={[errors.acronym]} />}
          </Field>

          <Field data-invalid={!!errors.officialName}>
            <FieldLabel>Nombre oficial</FieldLabel>
            <Input placeholder="Sociedad de Autores y Compositores de Colombia" {...register('officialName')} />
            {errors.officialName && <FieldError errors={[errors.officialName]} />}
          </Field>

          <Field data-invalid={!!errors.country}>
            <FieldLabel>País</FieldLabel>
            <Input placeholder="Colombia" {...register('country')} />
            {errors.country && <FieldError errors={[errors.country]} />}
          </Field>

          <Field data-invalid={!!errors.isoCountryCode}>
            <FieldLabel>Código ISO del país (alpha-2)</FieldLabel>
            <Input placeholder="CO" maxLength={2} {...register('isoCountryCode')} />
            {errors.isoCountryCode && <FieldError errors={[errors.isoCountryCode]} />}
          </Field>

          <Field>
            <FieldLabel>Código CISAC (opcional)</FieldLabel>
            <Input placeholder="84" {...register('cisacSocietyId')} />
          </Field>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : isEdit ? (
                'Guardar cambios'
              ) : (
                'Crear sociedad'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
