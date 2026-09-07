'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Field, FieldError, FieldLabel } from '@/src/shared/components/UI/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/components/UI/select'
import { DialogFooter } from '@/src/shared/components/UI/dialog'
import { CollectiveManagementSocietyCombobox } from './CollectiveManagementSocietyCombobox'
import { createSocietyAffiliationSchema, type CreateSocietyAffiliationFormValues } from '../society-affiliations.schema'
import { useCreateSocietyAffiliation } from '../society-affiliations.hooks'
import { RIGHTS_TYPE_LABELS } from '../society-affiliations.labels'
import { SocietyAffiliationRightsType } from '../society-affiliations.types'

interface Props {
  onSuccess: () => void
  onCancel: () => void
  cancelLabel?: string
  submitLabel?: string
}

/**
 * Campos del formulario de afiliación, sin el `Dialog` que lo envuelve —
 * reutilizado tanto por `SocietyAffiliationForm` (tab "Derechos y
 * Sociedades") como por `SocietyAffiliationOnboardingPrompt` (aviso antes de
 * publicar un track), que necesitan copy y acciones de cierre distintas.
 */
export function SocietyAffiliationFormFields({ onSuccess, onCancel, cancelLabel = 'Cancelar', submitLabel = 'Guardar afiliación' }: Props) {
  const { mutateAsync: createAffiliation, isPending } = useCreateSocietyAffiliation()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateSocietyAffiliationFormValues>({
    resolver: zodResolver(createSocietyAffiliationSchema),
    defaultValues: { collectiveManagementSocietyId: '', territory: '', membershipNumber: '', ipiNameNumber: '', validFrom: '' },
  })

  const onSubmit = async (values: CreateSocietyAffiliationFormValues) => {
    await createAffiliation({
      collectiveManagementSocietyId: values.collectiveManagementSocietyId,
      rightsType: values.rightsType,
      territory: values.territory,
      membershipNumber: values.membershipNumber || undefined,
      ipiNameNumber: values.ipiNameNumber || undefined,
      validFrom: values.validFrom || undefined,
    })
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
      <Controller
        name="collectiveManagementSocietyId"
        control={control}
        render={({ field }) => (
          <Field data-invalid={!!errors.collectiveManagementSocietyId}>
            <FieldLabel>Sociedad de Gestión Colectiva</FieldLabel>
            <CollectiveManagementSocietyCombobox
              value={field.value}
              onChange={field.onChange}
              aria-invalid={!!errors.collectiveManagementSocietyId}
            />
            {errors.collectiveManagementSocietyId && <FieldError errors={[errors.collectiveManagementSocietyId]} />}
          </Field>
        )}
      />

      <Controller
        name="rightsType"
        control={control}
        render={({ field }) => (
          <Field data-invalid={!!errors.rightsType}>
            <FieldLabel>Tipo de derecho</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger aria-invalid={!!errors.rightsType} className="w-full">
                <SelectValue placeholder="Selecciona un tipo de derecho" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(SocietyAffiliationRightsType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {RIGHTS_TYPE_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.rightsType && <FieldError errors={[errors.rightsType]} />}
          </Field>
        )}
      />

      <Field data-invalid={!!errors.territory}>
        <FieldLabel>Territorio (ISO 3166-1 alpha-2)</FieldLabel>
        <Input placeholder="CO" maxLength={2} {...register('territory')} />
        {errors.territory && <FieldError errors={[errors.territory]} />}
      </Field>

      <Field data-invalid={!!errors.membershipNumber}>
        <FieldLabel>Número de afiliación (opcional)</FieldLabel>
        <Input placeholder="12345" {...register('membershipNumber')} />
      </Field>

      <Field data-invalid={!!errors.ipiNameNumber}>
        <FieldLabel>IPI Name Number (opcional)</FieldLabel>
        <Input placeholder="12345678901" maxLength={11} {...register('ipiNameNumber')} />
        {errors.ipiNameNumber && <FieldError errors={[errors.ipiNameNumber]} />}
      </Field>

      <Field>
        <FieldLabel>Vigente desde (opcional)</FieldLabel>
        <Input type="date" {...register('validFrom')} />
      </Field>

      <DialogFooter className="pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          {cancelLabel}
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}
