'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { trackHooks } from '@/src/domains/tracks/hooks/use-tracks.hooks'
import { updateTrackSchema, type UpdateTrackFormValues } from '@domains/tracks/validations/track.schema'

import { Input } from '@/src/shared/components/UI/input'
import { Textarea } from '@shared/components/UI/textarea'
import { Button } from '@shared/components/UI/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@shared/components/UI/field'

import { GenreSelector } from '@domains/musical-genre/components/GenreSelector'
import { LanguageSelector } from '@domains/tracks/components/LanguageSelector'
import { ToggleFieldCard } from '@domains/tracks/components/ToggleFieldCard'
import { AdminEntitySelect, type AdminEntityOption } from '@/src/domains/admin/shared/AdminEntitySelect'
import { fetchUserOptions } from '@/src/domains/admin/shared/fetch-user-options'

export default function AdminEditTrackPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const trackId = params.id

  const { data: track, isLoading: isLoadingTrack } = trackHooks.useTrackById(trackId)
  const { mutateAsync: updateTrack, isPending } = trackHooks.useUpdateTrack()

  const methods = useForm<UpdateTrackFormValues>({
    resolver: zodResolver(updateTrackSchema),
    defaultValues: {
      title: '',
      genreId: '',
      subGenre: '',
      language: '',
      lyric: '',
      iswc: '',
      authorsIds: [],
      isAvailable: true,
      isGospel: false,
    },
  })

  const { control, handleSubmit, watch, setValue, reset } = methods

  useEffect(() => {
    if (track) {
      reset({
        title: track.title,
        genreId: track.genre || '',
        subGenre: track.subGenre || '',
        language: track.language || '',
        lyric: track.lyric || '',
        iswc: track.iswc || '',
        authorsIds: track.authors?.map((a) => a.id) ?? [],
        isAvailable: track.isAvailable,
        isGospel: track.isGospel,
      })
    }
  }, [track, reset])

  const authorOptions: AdminEntityOption[] =
    track?.authors?.map((a) => ({ value: a.id, label: `${a.name} ${a.lastName}`, description: a.email })) ?? []

  const onSubmit = async (data: UpdateTrackFormValues) => {
    if (!data.authorsIds?.length) {
      toast.error('Selecciona al menos un autor para el track')
      return
    }
    try {
      await updateTrack({
        id: trackId,
        data: {
          title: data.title,
          genreId: data.genreId,
          subGenre: data.subGenre,
          language: data.language,
          lyric: data.lyric,
          iswc: data.iswc,
          authorsIds: data.authorsIds,
          isAvailable: data.isAvailable,
          isGospel: data.isGospel,
        },
      })
      router.push('/admin/tracks')
    } catch (error) {
      toast.error('Error al actualizar el track', {
        description: error instanceof Error ? error.message : 'Error inesperado',
      })
    }
  }

  if (isLoadingTrack) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup className={isPending ? 'pointer-events-none opacity-60 transition-opacity' : ''}>
          <div>
            <h2 className="text-xl font-black tracking-tight">Editar Track</h2>
            <p className="text-sm text-muted-foreground">{track?.title}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
            <Controller
              name="authorsIds"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Autores</FieldLabel>
                  <AdminEntitySelect
                    multiple
                    value={field.value ?? []}
                    onChange={field.onChange}
                    fetchOptions={fetchUserOptions}
                    selectedOptions={authorOptions}
                    placeholder="Buscar autores por nombre o email..."
                  />
                </Field>
              )}
            />

            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Título</FieldLabel>
                  <Input placeholder="Ej: La casa en el cielo" {...field} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="iswc"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>ISWC (Opcional)</FieldLabel>
                  <Input placeholder="Ej: T-034.524.680-1" {...field} value={field.value || ''} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="genreId"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Clasificación musical</FieldLabel>
                  <GenreSelector
                    genreId={field.value}
                    subGenre={watch('subGenre')}
                    onGenreChange={field.onChange}
                    onSubGenreChange={(val) => setValue('subGenre', val, { shouldValidate: true })}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Idioma</FieldLabel>
                  <LanguageSelector value={field.value} onChange={field.onChange} />
                </Field>
              )}
            />

            <Controller
              name="lyric"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Letra</FieldLabel>
                  <Textarea className="min-h-[200px] resize-y" placeholder="Letra de la canción..." {...field} />
                </Field>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="isAvailable"
                control={control}
                render={({ field }) => (
                  <ToggleFieldCard
                    label="Pública"
                    description="Visible para todos"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Controller
                name="isGospel"
                control={control}
                render={({ field }) => (
                  <ToggleFieldCard
                    label="Música Gospel"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.push('/admin/tracks')} disabled={isPending}>
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
        </FieldGroup>
      </form>
    </FormProvider>
  )
}
