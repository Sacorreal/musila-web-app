'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { adminGuestsHooks } from '@/src/domains/admin/guests/admin-guests.hooks'
import { AdminEntitySelect } from '@/src/domains/admin/shared/AdminEntitySelect'
import { fetchUserOptions } from '@/src/domains/admin/shared/fetch-user-options'
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
import type { AdminGuestDto } from '@/src/domains/admin/guests/admin-guests.types'

const createSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  lastName: z.string().min(1, 'El apellido es obligatorio'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  invitedById: z.string().min(1, 'Debes seleccionar quién invita'),
  phone: z.string().optional(),
})

const editSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  lastName: z.string().min(1, 'El apellido es obligatorio'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
})

interface Props {
  isOpen: boolean
  onClose: () => void
  initialData?: AdminGuestDto | null
}

export function GuestFormDialog({ isOpen, onClose, initialData }: Props) {
  const isEdit = !!initialData
  const schema = isEdit ? editSchema : createSchema
  const { mutateAsync: createGuest, isPending: isCreating } = adminGuestsHooks.useCreateGuest()
  const { mutateAsync: updateGuest, isPending: isUpdating } = adminGuestsHooks.useUpdateGuest()
  const isPending = isCreating || isUpdating

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<any>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (isOpen) {
      reset({
        name: initialData?.name ?? '',
        lastName: initialData?.lastName ?? '',
        email: initialData?.email ?? '',
        phone: initialData?.phone ?? '',
        password: '',
        invitedById: initialData?.invited_by?.id ?? '',
      })
    }
  }, [isOpen, initialData, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (data: any) => {
    if (isEdit && initialData) {
      await updateGuest({
        id: initialData.id,
        input: { name: data.name, lastName: data.lastName, email: data.email, phone: data.phone },
      })
    } else {
      await createGuest(data)
    }
    handleClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Invitado' : 'Nuevo Invitado'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifica los datos del invitado.' : 'Crea un invitado directamente, sin pasar por el flujo de invitación.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={!!errors.name}>
              <FieldLabel>Nombre</FieldLabel>
              <Input {...register('name')} />
              {errors.name && <FieldError errors={[errors.name as any]} />}
            </Field>
            <Field data-invalid={!!errors.lastName}>
              <FieldLabel>Apellido</FieldLabel>
              <Input {...register('lastName')} />
              {errors.lastName && <FieldError errors={[errors.lastName as any]} />}
            </Field>
          </div>

          <Field data-invalid={!!errors.email}>
            <FieldLabel>Email</FieldLabel>
            <Input type="email" {...register('email')} />
            {errors.email && <FieldError errors={[errors.email as any]} />}
          </Field>

          <Field>
            <FieldLabel>Teléfono (opcional)</FieldLabel>
            <Input {...register('phone')} />
          </Field>

          {!isEdit && (
            <>
              <Field data-invalid={!!errors.password}>
                <FieldLabel>Contraseña</FieldLabel>
                <Input type="password" {...register('password')} />
                {errors.password && <FieldError errors={[errors.password as any]} />}
              </Field>

              <Controller
                name="invitedById"
                control={control}
                render={({ field }) => (
                  <Field data-invalid={!!errors.invitedById}>
                    <FieldLabel>Invitado por</FieldLabel>
                    <AdminEntitySelect
                      value={field.value || null}
                      onChange={field.onChange}
                      fetchOptions={fetchUserOptions}
                      placeholder="Buscar usuario que invita..."
                    />
                    {errors.invitedById && <FieldError errors={[errors.invitedById as any]} />}
                  </Field>
                )}
              />
            </>
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
              ) : isEdit ? (
                'Guardar Cambios'
              ) : (
                'Crear Invitado'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
