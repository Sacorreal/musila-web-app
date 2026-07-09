'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { adminRequestedTracksHooks } from '@/src/domains/admin/requested-tracks/admin-requested-tracks.hooks'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Field, FieldLabel } from '@/src/shared/components/UI/field'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/src/shared/components/UI/dialog'
import type { AdminRequestDto } from '@/src/domains/admin/types/admin.types'

const STATUS_OPTIONS = ['pendiente', 'aprobada', 'rechazada', 'cancelada']
const LICENSE_TYPE_OPTIONS = [
  'licencia de primer uso',
  'licencia traduccion',
  'licencia reproduccion',
  'licencia sincronizacion',
]

interface FormValues {
  status: string
  licenseType: string
  documentUrl: string
}

interface Props {
  request: AdminRequestDto | null
  onClose: () => void
}

export function RequestFormDialog({ request, onClose }: Props) {
  const { mutateAsync, isPending } = adminRequestedTracksHooks.useUpdateRequestedTrack()
  const { register, handleSubmit, reset } = useForm<FormValues>()

  useEffect(() => {
    if (request) {
      reset({
        status: request.status,
        licenseType: request.licenseType,
        documentUrl: request.documentUrl ?? '',
      })
    }
  }, [request, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (data: FormValues) => {
    if (!request) return
    await mutateAsync({ id: request.id, input: data })
    handleClose()
  }

  return (
    <Dialog open={!!request} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Solicitud</DialogTitle>
          <DialogDescription>
            {request?.track?.title} — {request?.requester?.name} {request?.requester?.lastName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Field>
            <FieldLabel>Estado</FieldLabel>
            <select
              {...register('status')}
              className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>

          <Field>
            <FieldLabel>Tipo de licencia</FieldLabel>
            <select
              {...register('licenseType')}
              className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              {LICENSE_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>

          <Field>
            <FieldLabel>URL del documento</FieldLabel>
            <Input {...register('documentUrl')} />
          </Field>

          <Field>
            <FieldLabel>Estado de pago (solo lectura)</FieldLabel>
            <Input value={request?.licensePaymentStatus ?? '—'} disabled readOnly />
            <p className="text-xs text-muted-foreground mt-1">
              Se sincroniza automáticamente con Wompi, no es editable desde el panel.
            </p>
          </Field>

          {request?.licensePrice != null && (
            <Field>
              <FieldLabel>Precio de licencia (solo lectura)</FieldLabel>
              <Input value={`$${request.licensePrice.toLocaleString('es-CO')} COP`} disabled readOnly />
            </Field>
          )}

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
              ) : (
                'Guardar Cambios'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
