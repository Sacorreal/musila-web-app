'use client'

import { useRouter } from 'next/navigation'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { useCreateTrack } from '@/src/domains/tracks/hooks/use-create-track'
import { createTrackSchema, type CreateTrackFormValues } from '@domains/tracks/validations/track.schema'

import { Input } from '@/src/shared/components/UI/input'
import { Textarea } from '@shared/components/UI/textarea'
import { Button } from '@shared/components/UI/button'
import { Progress } from '@shared/components/UI/progress'
import { Field, FieldError, FieldGroup, FieldLabel } from '@shared/components/UI/field'

import { GenreSelector } from '@domains/musical-genre/components/GenreSelector'
import { LanguageSelector } from '@domains/tracks/components/LanguageSelector'
import { AudioUploadField } from '@domains/tracks/components/AudioUploadField'
import { CoverImageUploadField } from '@domains/tracks/components/CoverImageUploadField'
import { ToggleFieldCard } from '@domains/tracks/components/ToggleFieldCard'
import { AdminEntitySelect } from '@/src/domains/admin/shared/AdminEntitySelect'
import { fetchUserOptions } from '@/src/domains/admin/shared/fetch-user-options'

export default function AdminNewTrackPage() {
  const router = useRouter()
  const { mutateAsync, isPending, globalProgress } = useCreateTrack()

  const methods = useForm<CreateTrackFormValues>({
    resolver: zodResolver(createTrackSchema),
    defaultValues: {
      title: '',
      genreId: '',
      subGenre: '',
      language: '',
      lyric: '',
      authorsIds: [],
      isAvailable: true,
      isGospel: false,
      intellectualProperties: [],
    },
  })

  const { control, handleSubmit, watch, setValue } = methods

  const onSubmit = async (data: CreateTrackFormValues) => {
    if (!data.authorsIds?.length) {
      toast.error('Selecciona al menos un autor para el track')
      return
    }
    try {
      await mutateAsync(data)
      toast.success('Track creado correctamente')
      router.push('/admin/tracks')
    } catch (error) {
      toast.error('Error al crear el track', {
        description: error instanceof Error ? error.message : 'Error inesperado',
      })
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit, () =>
          toast.error('Formulario incompleto', { description: 'Revisa los campos obligatorios en rojo.' }),
        )}
        className="space-y-6"
      >
        <FieldGroup className={isPending ? 'pointer-events-none opacity-60 transition-opacity' : ''}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight">Nuevo Track</h2>
              <p className="text-sm text-muted-foreground">Publica un track en nombre de uno o varios autores.</p>
            </div>
            {isPending && (
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground font-medium">
                  <span>Subiendo archivos...</span>
                  <span>{globalProgress}%</span>
                </div>
                <Progress value={globalProgress} className="h-2" />
              </div>
            )}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                name="audio"
                control={control}
                render={({ field, fieldState }) => (
                  <AudioUploadField value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
                )}
              />
            </div>

            <Controller
              name="coverImage"
              control={control}
              render={({ field }) => (
                <CoverImageUploadField value={field.value} onChange={field.onChange} />
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
                  Publicando...
                </>
              ) : (
                'Publicar Track'
              )}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </FormProvider>
  )
}
