'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { adminInvitesHooks } from '@/src/domains/admin/invites/admin-invites.hooks'
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

const schema = z.object({
  guestName: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('Email inválido'),
})

type FormValues = z.infer<typeof schema>

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function InviteFormDialog({ isOpen, onClose }: Props) {
  const { mutateAsync, isPending } = adminInvitesHooks.useCreateInvite()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const handleClose = () => {
    reset()
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
          <DialogTitle>Nueva Invitación</DialogTitle>
          <DialogDescription>Se enviará un correo con el enlace de invitación. Expira en 24 horas.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Field data-invalid={!!errors.guestName}>
            <FieldLabel>Nombre del invitado</FieldLabel>
            <Input placeholder="Juan Pérez" {...register('guestName')} />
            {errors.guestName && <FieldError errors={[errors.guestName]} />}
          </Field>
          <Field data-invalid={!!errors.email}>
            <FieldLabel>Email</FieldLabel>
            <Input type="email" placeholder="juan@ejemplo.com" {...register('email')} />
            {errors.email && <FieldError errors={[errors.email]} />}
          </Field>

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
                'Crear Invitación'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
