'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, ShieldPlus } from 'lucide-react'
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

const schema = z
  .object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    lastName: z.string().min(1, 'El apellido es obligatorio'),
    email: z.string().email('Email inválido'),
    citizenID: z.string().optional(),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma la contraseña'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function CreateAdminDialog({ isOpen, onClose }: Props) {
  const { mutateAsync, isPending } = adminHooks.useCreateAdminUser()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormValues) => {
    const { confirmPassword, ...payload } = data
    await mutateAsync(payload)
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { reset(); onClose() } }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldPlus className="h-5 w-5 text-red-500" />
            Crear Administrador
          </DialogTitle>
          <DialogDescription>
            El usuario se creará directamente con rol <strong>ADMIN</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={!!errors.name}>
              <FieldLabel>Nombre</FieldLabel>
              <Input placeholder="Juan" {...register('name')} />
              {errors.name && <FieldError errors={[errors.name]} />}
            </Field>
            <Field data-invalid={!!errors.lastName}>
              <FieldLabel>Apellido</FieldLabel>
              <Input placeholder="Pérez" {...register('lastName')} />
              {errors.lastName && <FieldError errors={[errors.lastName]} />}
            </Field>
          </div>

          <Field data-invalid={!!errors.email}>
            <FieldLabel>Email</FieldLabel>
            <Input type="email" placeholder="admin@musila.com" {...register('email')} />
            {errors.email && <FieldError errors={[errors.email]} />}
          </Field>

          <Field>
            <FieldLabel>Documento de identidad (opcional)</FieldLabel>
            <Input placeholder="12345678" {...register('citizenID')} />
          </Field>

          <Field data-invalid={!!errors.password}>
            <FieldLabel>Contraseña</FieldLabel>
            <Input type="password" placeholder="Mínimo 8 caracteres" {...register('password')} />
            {errors.password && <FieldError errors={[errors.password]} />}
          </Field>

          <Field data-invalid={!!errors.confirmPassword}>
            <FieldLabel>Confirmar Contraseña</FieldLabel>
            <Input type="password" placeholder="Repite la contraseña" {...register('confirmPassword')} />
            {errors.confirmPassword && <FieldError errors={[errors.confirmPassword]} />}
          </Field>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => { reset(); onClose() }} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="bg-red-600 hover:bg-red-700 text-white">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Admin'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
