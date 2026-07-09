'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Handshake } from 'lucide-react'
import { adminAffiliatesHooks } from '@/src/domains/admin/affiliates/admin-affiliates.hooks'
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
  name: z.string().min(1, 'El nombre es obligatorio'),
  lastName: z.string().min(1, 'El apellido es obligatorio'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  phone: z.string().optional(),
  companyOrBrand: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function AffiliateFormDialog({ isOpen, onClose }: Props) {
  const { mutateAsync, isPending } = adminAffiliatesHooks.useCreateAffiliate()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormValues) => {
    await mutateAsync(data)
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { reset(); onClose() } }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Handshake className="h-5 w-5 text-primary" />
            Nuevo Afiliado
          </DialogTitle>
          <DialogDescription>
            Se generará automáticamente un código de referido único para este afiliado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={!!errors.name}>
              <FieldLabel>Nombre</FieldLabel>
              <Input placeholder="Sofía" {...register('name')} />
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
            <Input type="email" placeholder="afiliado@ejemplo.com" {...register('email')} />
            {errors.email && <FieldError errors={[errors.email]} />}
          </Field>

          <Field data-invalid={!!errors.password}>
            <FieldLabel>Contraseña</FieldLabel>
            <Input type="password" placeholder="Mínimo 6 caracteres" {...register('password')} />
            {errors.password && <FieldError errors={[errors.password]} />}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Teléfono (opcional)</FieldLabel>
              <Input placeholder="3000000000" {...register('phone')} />
            </Field>
            <Field>
              <FieldLabel>Marca/Empresa (opcional)</FieldLabel>
              <Input placeholder="Estudio XYZ" {...register('companyOrBrand')} />
            </Field>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => { reset(); onClose() }} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Afiliado'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
