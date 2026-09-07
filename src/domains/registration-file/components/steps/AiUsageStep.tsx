'use client'

import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Textarea } from '@/src/shared/components/UI/textarea'
import { Switch } from '@/src/shared/components/UI/switch'
import { Field, FieldLabel, FieldDescription } from '@/src/shared/components/UI/field'
import { useUpdateAiUsage } from '../../hooks/use-registration-file.hooks'
import { aiUsageSchema, type AiUsageFormValues } from '../../validations/registration-file.schemas'
import type { RegistrationFileDto } from '../../types/registration-file.types'

interface Props {
  registrationFile: RegistrationFileDto
  onNext: () => void
}

export function AiUsageStep({ registrationFile, onNext }: Props) {
  const { mutateAsync, isPending } = useUpdateAiUsage()
  const data = registrationFile.aiUsageData

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
  } = useForm<AiUsageFormValues>({
    resolver: zodResolver(aiUsageSchema),
    defaultValues: {
      usedAi: data?.usedAi ?? false,
      toolUsed: data?.toolUsed ?? '',
      participationLevel: data?.participationLevel ?? '',
      observations: data?.observations ?? '',
    },
  })

  const usedAi = watch('usedAi')

  useEffect(() => {
    reset({
      usedAi: data?.usedAi ?? false,
      toolUsed: data?.toolUsed ?? '',
      participationLevel: data?.participationLevel ?? '',
      observations: data?.observations ?? '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrationFile.id])

  const onSubmit = async (values: AiUsageFormValues) => {
    await mutateAsync({ id: registrationFile.id, payload: values })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        control={control}
        name="usedAi"
        render={({ field }) => (
          <Field orientation="horizontal">
            <FieldLabel>¿Esta obra fue creada con Inteligencia Artificial?</FieldLabel>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </Field>
        )}
      />

      {usedAi && (
        <div className="space-y-4 rounded-lg border p-4">
          <Field>
            <FieldLabel>Herramienta de IA utilizada</FieldLabel>
            <Input {...register('toolUsed')} />
            <FieldDescription>Opcional — así lo indica el formulario oficial de SAYCO.</FieldDescription>
          </Field>

          <Field>
            <FieldLabel>Nivel de participación (opcional)</FieldLabel>
            <Input {...register('participationLevel')} placeholder="Ej. asistencia en letra, producción, etc." />
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
