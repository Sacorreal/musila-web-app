'use client';

import { useRouter } from "next/navigation";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserCircle, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from "sonner";

// Stores & Hooks
import { useAuthStore } from '@domains/auth/store/useAuthStore';
import { useCreateTrack } from '@domains/tracks/hooks/useCreateTrack';

// Validations
import { createTrackSchema, type CreateTrackFormValues } from '../../validations/track.schema';

// UI Components (Shadcn & Custom)
import { Input } from "@/src/shared/components/UI/input";
import { Textarea } from '@shared/components/UI/textarea';
import { Switch } from '@shared/components/UI/switch';
import { Button } from "@shared/components/UI/button";
import { Progress } from "@shared/components/UI/progress";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@shared/components/UI/field";

// Domain Components
import { GenreSelector } from '@domains/musical-genre/components/GenreSelector';
import { LanguageSelector } from '../create-track-form/LanguageSelector';
import { AudioUploadField } from '../create-track-form/AudioUploadField';

export function CreateTrackForm() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  // 1️⃣ Utilizamos el hook unificado. Él se encarga de todo el flujo y estado.
  const { mutateAsync, isPending, globalProgress } = useCreateTrack();

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

  // 2️⃣ Lógica de envío limpia y unificada
  const onSubmit = async (data: CreateTrackFormValues) => {
    if (!user?.id) {
      toast.error("Acceso denegado", {
        description: "Debes iniciar sesión para publicar una canción.",
      });
      return;
    }

    const payload: CreateTrackFormValues = {
      ...data,
      // Garantizamos que siempre haya un autor
      authorsIds: data.authorsIds?.length ? data.authorsIds : [user.id],
    };

    try {
      // Ejecutamos la mutación que orquesta firmas, subidas a Spaces y BD
      await mutateAsync(payload);

      toast.success("¡Canción publicada con éxito!");
      reset();
      router.push("/music");
    } catch (error) {
      toast.error("Error al publicar la canción", {
        description: error instanceof Error ? error.message : "Error inesperado",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, () => {
        toast.error("Formulario incompleto", {
          description: "Revisa los campos obligatorios en rojo.",
        });
      })}
      className="mx-auto max-w-6xl px-6 py-12"
    >
      {/* Deshabilitamos la interacción (pointer-events-none) y bajamos la opacidad
        solo si está subiendo, para dar un excelente feedback visual 
      */}
      <FieldGroup className={isPending ? "pointer-events-none opacity-60 transition-opacity" : ""}>
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

            {/* Barra de progreso visible solo durante la subida */}
            {isPending && (
              <div className="w-full md:w-64 space-y-2 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex justify-between text-xs text-muted-foreground font-medium">
                  <span>Subiendo archivos...</span>
                  <span>{globalProgress}%</span>
                </div>
                <Progress value={globalProgress} className="h-2" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">

            {/* MAIN CONTENT (Columna Izquierda) */}
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

              {/* INFORMACIÓN BÁSICA */}
              <section className="rounded-2xl border bg-card p-8 shadow-sm space-y-8">
                <div>
                  <h2 className="text-lg font-semibold">Información básica</h2>
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
                      <Input placeholder="Ej: La casa en el cielo" {...field} />
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
                        subGenre={watch("subGenre")}
                        onGenreChange={field.onChange}
                        onSubGenreChange={(val) =>
                          setValue("subGenre", val, { shouldValidate: true })
                        }
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

                {/* COVER PREVIEW (UX Mejorado) */}
                <Controller
                  name="coverImage"
                  control={control}
                  render={({ field }) => {
                    const file = watch("coverImage");
                    const preview = file instanceof File ? URL.createObjectURL(file) : null;

                    return (
                      <Field>
                        <FieldLabel>Portada de la canción (Cover)</FieldLabel>
                        <div className="flex items-center gap-6 mt-2">
                          <label
                            htmlFor="cover-upload"
                            className="relative flex w-32 h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/50 hover:bg-muted transition-colors overflow-hidden group"
                          >
                            {preview ? (
                              <>
                                <img src={preview} alt="Cover preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <p className="text-white text-xs font-medium">Cambiar</p>
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                <span className="text-xs font-medium">Subir imagen</span>
                              </div>
                            )}
                            <input
                              id="cover-upload"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
                            />
                          </label>
                          <div className="text-xs text-muted-foreground space-y-1">                            
                            <p>Formatos: JPG, PNG. Máx 5MB.</p>
                          </div>
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
                      className="min-h-[240px] resize-y"
                      placeholder="Escribe o pega la letra de la canción aquí..."
                      {...field}
                    />
                  )}
                />
              </section>
            </div>

            {/* SIDEBAR STICKY (Columna Derecha) */}
            <aside className="space-y-8 lg:sticky lg:top-24 self-start">

              {/* CONFIGURACIÓN */}
              <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-6">
                <h2 className="text-lg font-semibold">Configuración</h2>

                <Controller
                  name="isAvailable"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between rounded-xl border p-4 hover:bg-muted/30 transition-colors">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">Pública</p>
                        <p className="text-xs text-muted-foreground">Visible para todos</p>
                      </div>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  )}
                />

                <Controller
                  name="isGospel"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between rounded-xl border p-4 hover:bg-muted/30 transition-colors">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">Música Gospel</p>
                        <p className="text-xs text-muted-foreground">¿Es una canción góspel?</p>
                      </div>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  )}
                />
              </div>

              {/* SUBMIT PANEL */}
              <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold transition-all"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Publicar canción"
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Al publicar, aceptas los términos de publicación. Podrás editar la metadata más adelante.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </FieldGroup>
    </form>
  );
}