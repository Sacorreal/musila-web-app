'use client'

import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Textarea } from '@/src/shared/components/UI/textarea'
import { Switch } from '@/src/shared/components/UI/switch'
import { Field, FieldLabel, FieldError } from '@/src/shared/components/UI/field'
import { useUpdateCommissionedWork } from '../../hooks/use-registration-file.hooks'
import { commissionedWorkSchema, type CommissionedWorkFormValues } from '../../validations/registration-file.schemas'
import type { RegistrationFileDto } from '../../types/registration-file.types'

interface Props {
  registrationFile: RegistrationFileDto
  onNext: () => void
}

export function CommissionedWorkStep({ registrationFile, onNext }: Props) {
  const { mutateAsync, isPending } = useUpdateCommissionedWork()
  const data = registrationFile.commissionedWorkData

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<CommissionedWorkFormValues>({
    resolver: zodResolver(commissionedWorkSchema),
    defaultValues: {
      isCommissioned: data?.isCommissioned ?? false,
      contractingCompany: data?.contractingCompany ?? '',
      observations: data?.observations ?? '',
    },
  })

  const isCommissioned = watch('isCommissioned')

  useEffect(() => {
    reset({
      isCommissioned: data?.isCommissioned ?? false,
      contractingCompany: data?.contractingCompany ?? '',
      observations: data?.observations ?? '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrationFile.id])

  const onSubmit = async (values: CommissionedWorkFormValues) => {
    await mutateAsync({ id: registrationFile.id, payload: values })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        control={control}
        name="isCommissioned"
        render={({ field }) => (
          <Field orientation="horizontal">
            <FieldLabel>¿Esta obra fue hecha por encargo?</FieldLabel>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </Field>
        )}
      />

      {isCommissioned && (
        <div className="space-y-4 rounded-lg border p-4">
          <Field data-invalid={!!errors.contractingCompany}>
            <FieldLabel>Compañía contratante</FieldLabel>
            <Input {...register('contractingCompany')} />
            {errors.contractingCompany && <FieldError errors={[errors.contractingCompany]} />}
          </Field>

          <Field>
            <FieldLabel>Observaciones (opcional)</FieldLabel>
            <Textarea {...register('observations')} rows={3} />
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
