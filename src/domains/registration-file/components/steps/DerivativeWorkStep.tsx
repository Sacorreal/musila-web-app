'use client'

import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Switch } from '@/src/shared/components/UI/switch'
import { Field, FieldLabel, FieldError } from '@/src/shared/components/UI/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/components/UI/select'
import { useUpdateDerivativeWork } from '../../hooks/use-registration-file.hooks'
import { derivativeWorkSchema, type DerivativeWorkFormValues } from '../../validations/registration-file.schemas'
import { OriginalWorkOrigin, type RegistrationFileDto } from '../../types/registration-file.types'

interface Props {
  registrationFile: RegistrationFileDto
  onNext: () => void
}

export function DerivativeWorkStep({ registrationFile, onNext }: Props) {
  const { mutateAsync, isPending } = useUpdateDerivativeWork()
  const data = registrationFile.derivativeWorkData

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<DerivativeWorkFormValues>({
    resolver: zodResolver(derivativeWorkSchema),
    defaultValues: {
      isDerivative: data?.isDerivative ?? false,
      originalWorkOrigin: data?.originalWorkOrigin ?? undefined,
      iswc: data?.iswc ?? '',
      preexistingWorkName: data?.preexistingWorkName ?? '',
      adaptationType: data?.adaptationType ?? '',
    },
  })

  const isDerivative = watch('isDerivative')

  useEffect(() => {
    reset({
      isDerivative: data?.isDerivative ?? false,
      originalWorkOrigin: data?.originalWorkOrigin ?? undefined,
      iswc: data?.iswc ?? '',
      preexistingWorkName: data?.preexistingWorkName ?? '',
      adaptationType: data?.adaptationType ?? '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrationFile.id])

  const onSubmit = async (values: DerivativeWorkFormValues) => {
    await mutateAsync({ id: registrationFile.id, payload: values })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        control={control}
        name="isDerivative"
        render={({ field }) => (
          <Field orientation="horizontal">
            <FieldLabel>¿Esta obra es una obra derivada?</FieldLabel>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </Field>
        )}
      />

      {isDerivative && (
        <div className="space-y-4 rounded-lg border p-4">
          <Controller
            control={control}
            name="originalWorkOrigin"
            render={({ field }) => (
              <Field data-invalid={!!errors.originalWorkOrigin}>
                <FieldLabel>Origen de la obra preexistente</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={OriginalWorkOrigin.PRIVADA}>Privada</SelectItem>
                    <SelectItem value={OriginalWorkOrigin.DOMINIO_PUBLICO}>Dominio público</SelectItem>
                  </SelectContent>
                </Select>
                {errors.originalWorkOrigin && <FieldError errors={[errors.originalWorkOrigin]} />}
              </Field>
            )}
          />

          <Field data-invalid={!!errors.iswc}>
            <FieldLabel>ISWC</FieldLabel>
            <Input {...register('iswc')} />
            {errors.iswc && <FieldError errors={[errors.iswc]} />}
          </Field>

          <Field data-invalid={!!errors.preexistingWorkName}>
            <FieldLabel>Nombre de la obra preexistente</FieldLabel>
            <Input {...register('preexistingWorkName')} />
            {errors.preexistingWorkName && <FieldError errors={[errors.preexistingWorkName]} />}
          </Field>

          <Field>
            <FieldLabel>Tipo de adaptación (opcional)</FieldLabel>
            <Input {...register('adaptationType')} />
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
