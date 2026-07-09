'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { adminNotificationsHooks } from '@/src/domains/admin/notifications/admin-notifications.hooks'
import { AdminEntitySelect } from '@/src/domains/admin/shared/AdminEntitySelect'
import { fetchUserOptions } from '@/src/domains/admin/shared/fetch-user-options'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Textarea } from '@/src/shared/components/UI/textarea'
import { Field, FieldLabel, FieldError } from '@/src/shared/components/UI/field'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/src/shared/components/UI/dialog'

const schema = z.object({
  recipientId: z.string().min(1, 'Debes seleccionar un destinatario'),
  title: z.string().min(1, 'El título es obligatorio'),
  message: z.string().min(1, 'El mensaje es obligatorio'),
  type: z.string().optional(),
  link: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function NotificationFormDialog({ isOpen, onClose }: Props) {
  const { mutateAsync, isPending } = adminNotificationsHooks.useCreateNotification()
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { type: 'system' } })

  const handleClose = () => {
    reset({ recipientId: '', title: '', message: '', type: 'system', link: '' })
    onClose()
  }

  const onSubmit = async (data: FormValues) => {
    await mutateAsync(data)
    handleClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva Notificación</DialogTitle>
          <DialogDescription>Se enviará en tiempo real al usuario seleccionado.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Controller
            name="recipientId"
            control={control}
            render={({ field }) => (
              <Field data-invalid={!!errors.recipientId}>
                <FieldLabel>Destinatario</FieldLabel>
                <AdminEntitySelect
                  value={field.value || null}
                  onChange={field.onChange}
                  fetchOptions={fetchUserOptions}
                  placeholder="Buscar usuario..."
                />
                {errors.recipientId && <FieldError errors={[errors.recipientId]} />}
              </Field>
            )}
          />

          <Field data-invalid={!!errors.title}>
            <FieldLabel>Título</FieldLabel>
            <Input placeholder="Anuncio del sistema" {...register('title')} />
            {errors.title && <FieldError errors={[errors.title]} />}
          </Field>

          <Field data-invalid={!!errors.message}>
            <FieldLabel>Mensaje</FieldLabel>
            <Textarea rows={3} placeholder="Contenido de la notificación..." {...register('message')} />
            {errors.message && <FieldError errors={[errors.message]} />}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Tipo</FieldLabel>
              <Input placeholder="system" {...register('type')} />
            </Field>
            <Field>
              <FieldLabel>Enlace (opcional)</FieldLabel>
              <Input placeholder="/music/settings" {...register('link')} />
            </Field>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Notificación'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
