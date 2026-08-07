'use client'

import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Switch } from '@/src/shared/components/UI/switch'
import { Field, FieldLabel, FieldError } from '@/src/shared/components/UI/field'
import { PublishingContractSelector } from '@/src/domains/publishing-contracts/components/PublishingContractSelector'
import { useUpdatePublishing } from '../../hooks/use-registration-file.hooks'
import { publishingSchema, type PublishingFormValues } from '../../validations/registration-file.schemas'
import type { RegistrationFileDto } from '../../types/registration-file.types'

interface Props {
  registrationFile: RegistrationFileDto
  onNext: () => void
}

export function PublishingStep({ registrationFile, onNext }: Props) {
  const { mutateAsync, isPending } = useUpdatePublishing()

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<PublishingFormValues>({
    resolver: zodResolver(publishingSchema),
    defaultValues: {
      hasPublishingDeal: registrationFile.hasPublishingDeal,
      publishingContractId: registrationFile.publishingContract?.id,
      publishingAdministeredPercentage: registrationFile.publishingAdministeredPercentage ?? undefined,
    },
  })

  const hasPublishingDeal = watch('hasPublishingDeal')

  useEffect(() => {
    reset({
      hasPublishingDeal: registrationFile.hasPublishingDeal,
      publishingContractId: registrationFile.publishingContract?.id,
      publishingAdministeredPercentage: registrationFile.publishingAdministeredPercentage ?? undefined,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrationFile.id])

  const onSubmit = async (values: PublishingFormValues) => {
    await mutateAsync({ id: registrationFile.id, payload: values })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        control={control}
        name="hasPublishingDeal"
        render={({ field }) => (
          <Field orientation="horizontal">
            <FieldLabel>¿Esta obra está cubierta por un contrato editorial?</FieldLabel>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </Field>
        )}
      />

      {hasPublishingDeal && (
        <div className="space-y-4 rounded-lg border p-4">
          <Controller
            control={control}
            name="publishingContractId"
            render={({ field }) => (
              <Field data-invalid={!!errors.publishingContractId}>
                <FieldLabel>Contrato editorial</FieldLabel>
                <PublishingContractSelector value={field.value} onChange={field.onChange} />
                {errors.publishingContractId && <FieldError errors={[errors.publishingContractId]} />}
              </Field>
            )}
          />

          <Field>
            <FieldLabel>% administrado por la editorial (opcional)</FieldLabel>
            <Input type="number" step="0.01" {...register('publishingAdministeredPercentage')} />
          </Field>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar y continuar'}
        </Button>
      </div>
    </form>
  )
}
