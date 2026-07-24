'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { adminUserProfileHooks } from '@/src/domains/admin/users-profile/admin-user-profile.hooks'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Textarea } from '@/src/shared/components/UI/textarea'
import { Switch } from '@/src/shared/components/UI/switch'
import { Field, FieldLabel, FieldError } from '@/src/shared/components/UI/field'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/shared/components/UI/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/src/shared/components/UI/dialog'
import type { AdminUserDto } from '@/src/domains/admin/types/admin.types'
import { MusicRole, MUSIC_ROLE_LABELS } from '@/src/domains/users/types/user.types'

const schema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  secondName: z.string().optional(),
  lastName: z.string().min(1, 'El apellido es obligatorio'),
  secondLastName: z.string().optional(),
  email: z.string().email('Email inválido'),
  countryCode: z.string().optional(),
  phone: z.string().optional(),
  typeCitizenID: z.string().optional(),
  citizenID: z.string().optional(),
  biography: z.string().optional(),
  isVerified: z.boolean(),
  role: z.nativeEnum(MusicRole),
  plan: z.enum(['free', 'pro']),
  planExpiresAt: z.string().optional(),
  fiscalName: z.string().optional(),
  taxId: z.string().optional(),
  fiscalAddress: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  user: AdminUserDto | null
  onClose: () => void
}

export function UserFormDialog({ user, onClose }: Props) {
  const { mutateAsync, isPending } = adminUserProfileHooks.useUpdateUserProfile()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        secondName: user.secondName ?? '',
        lastName: user.lastName,
        secondLastName: user.secondLastName ?? '',
        email: user.email,
        countryCode: user.countryCode ?? '',
        phone: user.phone ?? '',
        typeCitizenID: user.typeCitizenID ?? '',
        citizenID: user.citizenID ?? '',
        biography: user.biography ?? '',
        isVerified: user.isVerified,
        role: user.role,
        plan: user.plan,
        planExpiresAt: user.planExpiresAt ? user.planExpiresAt.slice(0, 10) : '',
        fiscalName: user.fiscalName ?? '',
        taxId: user.taxId ?? '',
        fiscalAddress: user.fiscalAddress ?? '',
      })
    }
  }, [user, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (data: FormValues) => {
    if (!user) return
    const { planExpiresAt, ...rest } = data
    await mutateAsync({
      id: user.id,
      input: {
        ...rest,
        planExpiresAt: planExpiresAt ? new Date(planExpiresAt).toISOString() : undefined,
      },
    })
    handleClose()
  }

  return (
    <Dialog open={!!user} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>{user?.email}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="pt-2">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="plan">Plan</TabsTrigger>
              <TabsTrigger value="billing">Facturación</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <Field data-invalid={!!errors.name}>
                  <FieldLabel>Nombre</FieldLabel>
                  <Input {...register('name')} />
                  {errors.name && <FieldError errors={[errors.name]} />}
                </Field>
                <Field>
                  <FieldLabel>Segundo nombre</FieldLabel>
                  <Input {...register('secondName')} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field data-invalid={!!errors.lastName}>
                  <FieldLabel>Apellido</FieldLabel>
                  <Input {...register('lastName')} />
                  {errors.lastName && <FieldError errors={[errors.lastName]} />}
                </Field>
                <Field>
                  <FieldLabel>Segundo apellido</FieldLabel>
                  <Input {...register('secondLastName')} />
                </Field>
              </div>
              <Field data-invalid={!!errors.email}>
                <FieldLabel>Email</FieldLabel>
                <Input type="email" {...register('email')} />
                {errors.email && <FieldError errors={[errors.email]} />}
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Código de país</FieldLabel>
                  <Input placeholder="+57" {...register('countryCode')} />
                </Field>
                <Field>
                  <FieldLabel>Teléfono</FieldLabel>
                  <Input {...register('phone')} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Tipo de documento</FieldLabel>
                  <Input placeholder="CC" {...register('typeCitizenID')} />
                </Field>
                <Field>
                  <FieldLabel>Número de documento</FieldLabel>
                  <Input {...register('citizenID')} />
                </Field>
              </div>
              <Field>
                <FieldLabel>Biografía</FieldLabel>
                <Textarea rows={3} {...register('biography')} />
              </Field>
              <div className="flex items-center justify-between rounded-xl border p-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Verificado</p>
                  <p className="text-xs text-muted-foreground">Cuenta con email/identidad verificada</p>
                </div>
                <Switch checked={watch('isVerified')} onCheckedChange={(v) => setValue('isVerified', v)} />
              </div>
              <Field data-invalid={!!errors.role}>
                <FieldLabel>Rol (disciplina musical)</FieldLabel>
                <select
                  {...register('role')}
                  className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  {Object.values(MusicRole).map((r) => (
                    <option key={r} value={r}>{MUSIC_ROLE_LABELS[r]}</option>
                  ))}
                </select>
                {errors.role && <FieldError errors={[errors.role]} />}
              </Field>
            </TabsContent>

            <TabsContent value="plan" className="space-y-4 pt-4">
              <Field>
                <FieldLabel>Plan</FieldLabel>
                <select
                  {...register('plan')}
                  className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                </select>
              </Field>
              <Field>
                <FieldLabel>Fecha de expiración del plan</FieldLabel>
                <Input type="date" {...register('planExpiresAt')} />
              </Field>
            </TabsContent>

            <TabsContent value="billing" className="space-y-4 pt-4">
              <Field>
                <FieldLabel>Razón social / Nombre para facturación</FieldLabel>
                <Input {...register('fiscalName')} />
              </Field>
              <Field>
                <FieldLabel>NIT / RUT / RFC</FieldLabel>
                <Input {...register('taxId')} />
              </Field>
              <Field>
                <FieldLabel>Dirección fiscal</FieldLabel>
                <Textarea rows={2} {...register('fiscalAddress')} />
              </Field>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-6">
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
