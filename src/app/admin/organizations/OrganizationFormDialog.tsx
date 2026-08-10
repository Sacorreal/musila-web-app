'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { adminOrganizationsHooks } from '@/src/domains/admin/organizations/organizations.hooks'
import { adminPlansHooks } from '@/src/domains/admin/plans/plans.hooks'
import { AdminEntitySelect } from '@/src/domains/admin/shared/AdminEntitySelect'
import { fetchUserOptions } from '@/src/domains/admin/shared/fetch-user-options'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Field, FieldLabel, FieldError } from '@/src/shared/components/UI/field'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/shared/components/UI/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/UI/select'

const ORGANIZATION_TYPES = [
  { value: 'LABEL', label: 'Label' },
  { value: 'PUBLISHER', label: 'Publisher' },
  { value: 'MANAGEMENT', label: 'Management' },
  { value: 'AGENCY', label: 'Agencia' },
  { value: 'MUSIC_LIBRARY', label: 'Music Library' },
  { value: 'OTHER', label: 'Otro' },
] as const

const schema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(150),
  slug: z
    .string()
    .min(1, 'El slug es obligatorio')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Solo minúsculas, números y guiones'),
  type: z.enum(['LABEL', 'PUBLISHER', 'MANAGEMENT', 'AGENCY', 'MUSIC_LIBRARY', 'OTHER']),
  planKey: z.string().optional(),
  adminUserId: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface OrganizationFormDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function OrganizationFormDialog({ isOpen, onClose }: OrganizationFormDialogProps) {
  const { mutate: createOrganization, isPending } = adminOrganizationsHooks.useCreateOrganization()
  const { data: plans } = adminPlansHooks.usePlans()
  const [adminUserId, setAdminUserId] = useState<string | null>(null)

  const organizationPlans = (plans ?? []).filter((plan) => plan.subjectType === 'ORGANIZATION')

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'LABEL' },
  })

  useEffect(() => {
    if (isOpen) {
      reset({ name: '', slug: '', type: 'LABEL', planKey: undefined, adminUserId: undefined })
      setAdminUserId(null)
    }
  }, [isOpen, reset])

  const onSubmit = (values: FormValues) => {
    createOrganization(
      {
        name: values.name,
        slug: values.slug,
        type: values.type,
        planKey: values.planKey || undefined,
        adminUserId: adminUserId ?? undefined,
      },
      { onSuccess: onClose },
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nueva organización B2B</DialogTitle>
          <DialogDescription>
            Crea el tenant, la organización y su workspace default. Opcionalmente contrata un plan
            B2B y designa al Organization Admin inicial.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="org-name">Nombre</FieldLabel>
            <Input id="org-name" placeholder="Sony Music" {...register('name')} />
            {errors.name && <FieldError errors={[{ message: errors.name.message! }]} />}
          </Field>

          <Field data-invalid={!!errors.slug}>
            <FieldLabel htmlFor="org-slug">Slug</FieldLabel>
            <Input id="org-slug" placeholder="sony-music" {...register('slug')} />
            {errors.slug && <FieldError errors={[{ message: errors.slug.message! }]} />}
          </Field>

          <Field data-invalid={!!errors.type}>
            <FieldLabel>Tipo de organización</FieldLabel>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORGANIZATION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && <FieldError errors={[{ message: errors.type.message! }]} />}
          </Field>

          {organizationPlans.length > 0 && (
            <Field>
              <FieldLabel>Plan B2B (opcional)</FieldLabel>
              <Controller
                control={control}
                name="planKey"
                render={({ field }) => (
                  <Select value={field.value ?? ''} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sin plan por ahora" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizationPlans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.key}>
                          {plan.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          )}

          <Field>
            <FieldLabel>Organization Admin inicial (opcional)</FieldLabel>
            <AdminEntitySelect
              value={adminUserId}
              onChange={setAdminUserId}
              fetchOptions={fetchUserOptions}
              placeholder="Buscar usuario por nombre o email..."
            />
          </Field>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Crear organización
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
