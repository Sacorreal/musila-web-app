'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { adminIpHooks } from '@/src/domains/admin/intellectual-property/admin-ip.hooks'
import { AdminEntitySelect } from '@/src/domains/admin/shared/AdminEntitySelect'
import { fetchTrackOptions } from '@/src/domains/admin/shared/fetch-user-options'
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
import { IntellectualPropertyType, type AdminIntellectualPropertyDto } from '@/src/domains/admin/intellectual-property/admin-ip.types'

const schema = z.object({
  type: z.nativeEnum(IntellectualPropertyType),
  key: z.string().min(1, 'La clave es obligatoria'),
  trackId: z.string().min(1, 'Debes seleccionar un track'),
  documentUrl: z.string().url('Debe ser una URL válida'),
  documentKey: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  isOpen: boolean
  onClose: () => void
  initialData?: AdminIntellectualPropertyDto | null
}

const TYPE_LABELS: Record<string, string> = {
  copyrightOffice: 'Copyright Office',
  cmo: 'CMO',
  splitSheet: 'Split Sheet',
}

export function IPFormDialog({ isOpen, onClose, initialData }: Props) {
  const isEdit = !!initialData
  const { mutateAsync: createIp, isPending: isCreating } = adminIpHooks.useCreateIntellectualProperty()
  const { mutateAsync: updateIp, isPending: isUpdating } = adminIpHooks.useUpdateIntellectualProperty()
  const isPending = isCreating || isUpdating

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (isOpen) {
      reset({
        type: initialData?.type ?? IntellectualPropertyType.CMO,
        key: initialData?.key ?? '',
        trackId: initialData?.track?.id ?? '',
        documentUrl: initialData?.documentUrl ?? '',
        documentKey: initialData?.documentKey ?? '',
      })
    }
  }, [isOpen, initialData, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (data: FormValues) => {
    if (isEdit && initialData) {
      await updateIp({ id: initialData.id, input: data })
    } else {
      await createIp(data)
    }
    handleClose()
  }

  const trackOptions = initialData?.track ? [{ value: initialData.track.id, label: initialData.track.title }] : []

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Registro' : 'Nuevo Registro de Propiedad Intelectual'}</DialogTitle>
          <DialogDescription>Vincula un documento legal (CMO, copyright office o split sheet) a un track.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Controller
            name="trackId"
            control={control}
            render={({ field }) => (
              <Field data-invalid={!!errors.trackId}>
                <FieldLabel>Track</FieldLabel>
                <AdminEntitySelect
                  value={field.value || null}
                  onChange={field.onChange}
                  fetchOptions={fetchTrackOptions}
                  selectedOptions={trackOptions}
                  placeholder="Buscar track por título..."
                />
                {errors.trackId && <FieldError errors={[errors.trackId]} />}
              </Field>
            )}
          />

          <Field data-invalid={!!errors.type}>
            <FieldLabel>Tipo</FieldLabel>
            <select
              {...register('type')}
              className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              {Object.values(IntellectualPropertyType).map((t) => (
                <option key={t} value={t}>{TYPE_LABELS[t]}</option>
              ))}
            </select>
          </Field>

          <Field data-invalid={!!errors.key}>
            <FieldLabel>Clave (país / acrónimo CMO)</FieldLabel>
            <Input placeholder="SAYCO" {...register('key')} />
            {errors.key && <FieldError errors={[errors.key]} />}
          </Field>

          <Field data-invalid={!!errors.documentUrl}>
            <FieldLabel>URL del documento</FieldLabel>
            <Input placeholder="https://cdn.musila.com/docs/123.pdf" {...register('documentUrl')} />
            {errors.documentUrl && <FieldError errors={[errors.documentUrl]} />}
          </Field>

          <Field>
            <FieldLabel>Llave de almacenamiento (opcional)</FieldLabel>
            <Input placeholder="intellectual-property/doc123.pdf" {...register('documentKey')} />
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
                'Guardar Cambios'
              ) : (
                'Crear Registro'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
