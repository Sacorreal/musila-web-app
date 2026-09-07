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
import { useUpdatePhonogram } from '../../hooks/use-registration-file.hooks'
import { phonogramSchema, type PhonogramFormValues } from '../../validations/registration-file.schemas'
import { RecordingType, type RegistrationFileDto } from '../../types/registration-file.types'

interface Props {
  registrationFile: RegistrationFileDto
  onNext: () => void
}

export function PhonogramStep({ registrationFile, onNext }: Props) {
  const { mutateAsync, isPending } = useUpdatePhonogram()
  const data = registrationFile.phonogramData

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<PhonogramFormValues>({
    resolver: zodResolver(phonogramSchema),
    defaultValues: {
      hasRecording: data?.hasRecording ?? false,
      recordingType: data?.recordingType ?? undefined,
      isrc: data?.isrc ?? '',
      upc: data?.upc ?? '',
      mainArtistName: data?.mainArtistName ?? '',
      albumOrEpName: data?.albumOrEpName ?? '',
      releaseDate: data?.releaseDate ?? '',
      phonogramProducer: data?.phonogramProducer ?? '',
      phonogramOwner: data?.phonogramOwner ?? '',
      recordingDate: data?.recordingDate ?? '',
    },
  })

  const hasRecording = watch('hasRecording')

  useEffect(() => {
    reset({
      hasRecording: data?.hasRecording ?? false,
      recordingType: data?.recordingType ?? undefined,
      isrc: data?.isrc ?? '',
      upc: data?.upc ?? '',
      mainArtistName: data?.mainArtistName ?? '',
      albumOrEpName: data?.albumOrEpName ?? '',
      releaseDate: data?.releaseDate ?? '',
      phonogramProducer: data?.phonogramProducer ?? '',
      phonogramOwner: data?.phonogramOwner ?? '',
      recordingDate: data?.recordingDate ?? '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrationFile.id])

  const onSubmit = async (values: PhonogramFormValues) => {
    await mutateAsync({ id: registrationFile.id, payload: values })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        control={control}
        name="hasRecording"
        render={({ field }) => (
          <Field orientation="horizontal">
            <FieldLabel>¿La obra está grabada?</FieldLabel>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </Field>
        )}
      />

      {hasRecording && (
        <div className="space-y-4 rounded-lg border p-4">
          <Controller
            control={control}
            name="recordingType"
            render={({ field }) => (
              <Field data-invalid={!!errors.recordingType}>
                <FieldLabel>Tipo de grabación</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={RecordingType.MAQUETA}>Maqueta</SelectItem>
                    <SelectItem value={RecordingType.PROFESIONAL}>Profesional</SelectItem>
                  </SelectContent>
                </Select>
                {errors.recordingType && <FieldError errors={[errors.recordingType]} />}
              </Field>
            )}
          />

          <Field data-invalid={!!errors.isrc}>
            <FieldLabel>ISRC</FieldLabel>
            <Input {...register('isrc')} />
            {errors.isrc && <FieldError errors={[errors.isrc]} />}
          </Field>

          <Field data-invalid={!!errors.upc}>
            <FieldLabel>UPC</FieldLabel>
            <Input {...register('upc')} />
            {errors.upc && <FieldError errors={[errors.upc]} />}
          </Field>

          <Field data-invalid={!!errors.mainArtistName}>
            <FieldLabel>Artista principal</FieldLabel>
            <Input {...register('mainArtistName')} />
            {errors.mainArtistName && <FieldError errors={[errors.mainArtistName]} />}
          </Field>

          <Field data-invalid={!!errors.albumOrEpName}>
            <FieldLabel>Álbum o EP</FieldLabel>
            <Input {...register('albumOrEpName')} />
            {errors.albumOrEpName && <FieldError errors={[errors.albumOrEpName]} />}
          </Field>

          <Field data-invalid={!!errors.releaseDate}>
            <FieldLabel>Fecha de lanzamiento</FieldLabel>
            <Input type="date" {...register('releaseDate')} />
            {errors.releaseDate && <FieldError errors={[errors.releaseDate]} />}
          </Field>

          <Field data-invalid={!!errors.phonogramOwner}>
            <FieldLabel>Titular del fonograma</FieldLabel>
            <Input {...register('phonogramOwner')} />
            {errors.phonogramOwner && <FieldError errors={[errors.phonogramOwner]} />}
          </Field>

          <Field>
            <FieldLabel>Productor fonográfico</FieldLabel>
            <Input {...register('phonogramProducer')} />
          </Field>

          <Field>
            <FieldLabel>Fecha de grabación</FieldLabel>
            <Input type="date" {...register('recordingDate')} />
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
