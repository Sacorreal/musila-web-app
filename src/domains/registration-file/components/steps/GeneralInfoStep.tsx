'use client'

import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, X } from 'lucide-react'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Textarea } from '@/src/shared/components/UI/textarea'
import { Field, FieldLabel, FieldError } from '@/src/shared/components/UI/field'
import { useUpdateGeneralInfo } from '../../hooks/use-registration-file.hooks'
import { generalInfoSchema, type GeneralInfoFormValues } from '../../validations/registration-file.schemas'
import type { RegistrationFileDto } from '../../types/registration-file.types'

interface Props {
  registrationFile: RegistrationFileDto
  onNext: () => void
}

export function GeneralInfoStep({ registrationFile, onNext }: Props) {
  const { mutateAsync, isPending } = useUpdateGeneralInfo()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<GeneralInfoFormValues>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      title: registrationFile.title,
      alternativeTitles: registrationFile.alternativeTitles,
      language: registrationFile.language,
      ritmo: registrationFile.ritmo ?? '',
      durationSeconds: registrationFile.durationSeconds ?? undefined,
      creationDate: registrationFile.creationDate ?? '',
      creationPlace: registrationFile.creationPlace ?? '',
      workState: registrationFile.workState ?? undefined,
      version: registrationFile.version ?? '',
      description: registrationFile.description ?? '',
    },
  })

  useEffect(() => {
    reset({
      title: registrationFile.title,
      alternativeTitles: registrationFile.alternativeTitles,
      language: registrationFile.language,
      ritmo: registrationFile.ritmo ?? '',
      durationSeconds: registrationFile.durationSeconds ?? undefined,
      creationDate: registrationFile.creationDate ?? '',
      creationPlace: registrationFile.creationPlace ?? '',
      workState: registrationFile.workState ?? undefined,
      version: registrationFile.version ?? '',
      description: registrationFile.description ?? '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrationFile.id])

  const onSubmit = async (data: GeneralInfoFormValues) => {
    await mutateAsync({ id: registrationFile.id, payload: data })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field data-invalid={!!errors.title}>
        <FieldLabel>Título principal</FieldLabel>
        <Input {...register('title')} />
        {errors.title && <FieldError errors={[errors.title]} />}
      </Field>

      <Controller
        name="alternativeTitles"
        control={control}
        render={({ field }) => {
          const titles = field.value ?? []
          return (
            <Field>
              <FieldLabel>Títulos alternativos (opcional, máx. 4)</FieldLabel>
              <div className="space-y-2">
                {titles.map((title, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={title}
                      onChange={(e) => {
                        const next = [...titles]
                        next[index] = e.target.value
                        field.onChange(next)
                      }}
                      placeholder={`Título alterno ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => field.onChange(titles.filter((_, i) => i !== index))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {titles.length < 4 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => field.onChange([...titles, ''])}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Agregar título alternativo
                  </Button>
                )}
              </div>
            </Field>
          )
        }}
      />

      <div className="grid grid-cols-2 gap-3">
        <Field data-invalid={!!errors.language}>
          <FieldLabel>Idioma</FieldLabel>
          <Input {...register('language')} placeholder="Español" />
          {errors.language && <FieldError errors={[errors.language]} />}
        </Field>

        <Field data-invalid={!!errors.ritmo}>
          <FieldLabel>Ritmo</FieldLabel>
          <Input {...register('ritmo')} placeholder="Vallenato" />
          {errors.ritmo && <FieldError errors={[errors.ritmo]} />}
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field data-invalid={!!errors.durationSeconds}>
          <FieldLabel>Duración declarada (segundos)</FieldLabel>
          <Input type="number" {...register('durationSeconds')} />
          {errors.durationSeconds && <FieldError errors={[errors.durationSeconds]} />}
        </Field>

        <Field>
          <FieldLabel>Fecha de creación</FieldLabel>
          <Input type="date" {...register('creationDate')} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel>Lugar de creación</FieldLabel>
          <Input {...register('creationPlace')} placeholder="Bogotá, Colombia" />
        </Field>

        <Field>
          <FieldLabel>Versión</FieldLabel>
          <Input {...register('version')} placeholder="v1" />
        </Field>
      </div>

      <Field>
        <FieldLabel>Descripción (opcional)</FieldLabel>
        <Textarea {...register('description')} rows={3} />
      </Field>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar y continuar'}
        </Button>
      </div>
    </form>
  )
}
