'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, UserCircle } from 'lucide-react';
import { createTrackSchema, type CreateTrackFormValues } from '../validations/track.schema';
import { toast } from "sonner";
import { AudioUploadField } from './form-create-track/AudioUploadField';
import { useRouter } from "next/navigation";


import { useState } from "react"
// Store
import { useAuthStore } from '@domains/auth/store/useAuthStore';


import { Input } from "@/src/shared/components/UI/input";
import { Textarea } from '@shared/components/UI/textarea';
import { Switch } from '@shared/components/UI/switch';
import { Button } from "@shared/components/UI/button";
import { Progress } from "@shared/components/UI/progress"
import { useTrack } from '../hooks/useTrack';


import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldDescription
} from "@shared/components/UI/field";

// Componentes Dinámicos
import { GenreSelector } from '@domains/musical-genre/components/GenreSelector';
import { LanguageSelector } from './form-create-track/LanguageSelector';

export function CreateTrackForm() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [progress, setProgress] = useState(0)
  const { useCreateTrackMutation } = useTrack(setProgress)

  const { control, handleSubmit, watch, setValue, reset } = useForm<CreateTrackFormValues>({
    resolver: zodResolver(createTrackSchema),
    defaultValues: {
      title: '',
      genreId: '',
      subGenre: '',
      language: '',
      lyric: '',
      authorsIds: user?.id ? [user.id] : [],
      isAvailable: true,
      isGospel: false,
    },
  });


  const onSubmit = (data: CreateTrackFormValues) => {
    if (!user?.id) {
      toast.error("Debes iniciar sesión para publicar una canción.");
      return;
    }
    const payload: CreateTrackFormValues = {
      ...data,
      authorsIds:
        data.authorsIds && data.authorsIds.length > 0
          ? data.authorsIds
          : [user.id],
    };
    console.log("Datos listos para enviar al backend:", payload);
    setProgress(0);

    useCreateTrackMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Canción publicada con éxito!");
        reset();
        router.push("/music");
      },
      onError: (error) => {
        toast.error("Error al publicar la canción", {
          description:
            error instanceof Error ? error.message : "Error inesperado",
        });
      },
    });
  };

  const isSubmitting = useCreateTrackMutation.isPending;

  return (

    <form
      onSubmit={handleSubmit(
        onSubmit,
        (errors) => {
          console.log("Errores de validación del formulario de track:", errors);
          toast.error("Revisa los campos obligatorios del formulario.");
        }
      )}
      className="mx-auto max-w-6xl px-6 py-12"
    >
      <FieldGroup>
        <div className="space-y-12">

          {/* HEADER */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Publicar nueva canción
              </h1>
              <p className="text-muted-foreground mt-1 max-w-xl">
                Completa la información, adjunta los archivos y configura la disponibilidad.
              </p>
            </div>

            {isSubmitting && (
              <div className="w-64 space-y-2">
                <p className="text-xs text-muted-foreground">
                  Subiendo...
                </p>
                <Progress value={progress} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">

            {/* MAIN CONTENT */}
            <div className="space-y-10">

              {/* AUTOR INFO */}
              <div className="flex items-center gap-3 rounded-xl border bg-primary/5 p-4">
                <UserCircle className="w-6 h-6 text-primary" />
                <p className="text-sm">
                  Autor principal:
                  <span className="font-semibold ml-1">
                    {user?.name ?? 'Usuario actual'}
                  </span>
                </p>
              </div>

              {/* INFORMACIÓN */}
              <section className="rounded-2xl border bg-card p-8 shadow-sm space-y-8">

                <div>
                  <h2 className="text-lg font-semibold">
                    Información básica
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Datos principales de tu track.
                  </p>
                </div>

                <Controller
                  name="title"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Título</FieldLabel>
                      <Input
                        placeholder="Ej: La casa en el cielo"
                        {...field}
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
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
                        subGenre={watch("subGenre")}
                        onGenreChange={field.onChange}
                        onSubGenreChange={(val) =>
                          setValue("subGenre", val, { shouldValidate: true })
                        }
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
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
                        <LanguageSelector
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </Field>
                    )}
                  />

                  {/* AUDIO DROPZONE */}
                  <Controller
                    name="audio"
                    control={control}
                    render={({ field, fieldState }) => (
                      <AudioUploadField
                        value={field.value}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                </div>

                {/* COVER PREVIEW */}
                <Controller
                  name="coverImage"
                  control={control}
                  render={({ field }) => {
                    const file = watch("coverImage");
                    const preview =
                      file instanceof File
                        ? URL.createObjectURL(file)
                        : null;

                    return (
                      <Field>
                        <FieldLabel>Cover</FieldLabel>
                        <div className="flex items-center gap-6">
                          <div className="w-32 h-32 rounded-xl border overflow-hidden bg-muted">
                            {preview ? (
                              <img
                                src={preview}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                Sin portada
                              </div>
                            )}
                          </div>

                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0] ?? null)
                            }
                          />
                        </div>
                      </Field>
                    );
                  }}
                />
              </section>

              {/* LETRA */}
              <section className="rounded-2xl border bg-card p-8 shadow-sm space-y-4">
                <h2 className="text-lg font-semibold">Letra</h2>

                <Controller
                  name="lyric"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      className="min-h-[240px]"
                      placeholder="Escribe la letra aquí..."
                      {...field}
                    />
                  )}
                />
              </section>
            </div>

            {/* SIDEBAR STICKY */}
            <aside className="space-y-8 lg:sticky lg:top-24 self-start">

              {/* CONFIG */}
              <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-6">
                <h2 className="text-lg font-semibold">
                  Configuración
                </h2>

                <Controller
                  name="isAvailable"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between rounded-xl border p-4">
                      <div>
                        <p className="text-sm font-medium">
                          Disponible
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Visible en la plataforma
                        </p>
                      </div>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />

                <Controller
                  name="isGospel"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between rounded-xl border p-4">
                      <div>
                        <p className="text-sm font-medium">
                          Música Gospel
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ¿Es una canción Gospel?
                        </p>
                      </div>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />
              </div>

              {/* SUBMIT PANEL */}
              <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
                <Button
                  type="submit"
                  className="w-full h-11 text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Subiendo..." : "Publicar canción"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Podrás editar esta canción más adelante.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </FieldGroup>
    </form>
  );

}