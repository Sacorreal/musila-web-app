"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCircle, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

// Stores & Hooks
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import { trackHooks } from "@/src/domains/tracks/hooks/use-tracks.hooks";

// Validations
import {
  updateTrackSchema,
  type UpdateTrackFormValues,
} from "@domains/tracks/validations/track.schema";

// UI Components
import { Input } from "@/src/shared/components/UI/input";
import { Textarea } from "@shared/components/UI/textarea";
import { Switch } from "@shared/components/UI/switch";
import { Button } from "@shared/components/UI/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@shared/components/UI/field";

// Domain Components
import { GenreSelector } from "@domains/musical-genre/components/GenreSelector";
import { LanguageSelector } from "../components/LanguageSelector";

interface EditTrackFormProps {
  trackId: string;
}

export function EditTrackForm({ trackId }: EditTrackFormProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const { data: track, isLoading: isLoadingTrack } = trackHooks.useTrackById(trackId);
  const { mutateAsync: updateTrack, isPending } = trackHooks.useUpdateTrack();
  const [isSuccess, setIsSuccess] = useState(false);

  const methods = useForm<UpdateTrackFormValues>({
    resolver: zodResolver(updateTrackSchema),
    defaultValues: {
      title: "",
      genreId: "",
      subGenre: "",
      language: "",
      lyric: "",
      iswc: "",
      isAvailable: true,
      isGospel: false,
    },
  });

  const { control, handleSubmit, watch, setValue, reset } = methods;

  // Cargar datos cuando el track esté disponible
  useEffect(() => {
    if (track) {
      reset({
        title: track.title,
        genreId: track.genre || "", // Puede requerir lógica adicional si genre es el string y necesitas el ID
        subGenre: track.subGenre || "",
        language: track.language || "",
        lyric: track.lyric || "",
        iswc: track.iswc || "",
        isAvailable: track.isAvailable,
        isGospel: track.isGospel,
      });
    }
  }, [track, reset]);

  const onSubmit = async (data: UpdateTrackFormValues) => {
    if (!user?.id) {
      toast.error("Acceso denegado");
      return;
    }

    try {
      // Excluimos campos que no se pueden actualizar directamente sin lógica extra como audio/IP
      const payload = {
        title: data.title,
        genreId: data.genreId,
        subGenre: data.subGenre,
        language: data.language,
        lyric: data.lyric,
        iswc: data.iswc,
        isAvailable: data.isAvailable,
        isGospel: data.isGospel,
      };

      await updateTrack({ id: trackId, data: payload });
      setIsSuccess(true);
      
      setTimeout(() => {
        router.push("/music/mi-musica");
      }, 3000);
    } catch (error) {
      toast.error("Error al actualizar la canción", {
        description: error instanceof Error ? error.message : "Error inesperado",
      });
    }
  };

  if (isLoadingTrack) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="relative w-28 h-28 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
            <CheckCircle2 className="w-14 h-14 text-white animate-bounce" />
          </div>
        </div>
        
        <div className="space-y-4 mb-10">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            ¡Canción Actualizada!
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Los cambios se han guardado correctamente.
          </p>
        </div>

        <Button 
          className="rounded-2xl h-14 bg-slate-900 dark:bg-white dark:text-slate-900 font-black text-lg shadow-xl"
          onClick={() => router.push("/music/mi-musica")}
        >
          Volver a Mis Canciones
        </Button>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-6xl px-6 py-12">
        <FieldGroup className={isPending ? "pointer-events-none opacity-60 transition-opacity" : ""}>
          <div className="space-y-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Editar canción</h1>
                <p className="text-muted-foreground mt-1 max-w-xl">
                  Modifica la información y metadata de tu track.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
              <div className="space-y-10">
                <section className="rounded-2xl border bg-card p-8 shadow-sm space-y-8">
                  <div>
                    <h2 className="text-lg font-semibold">Información básica</h2>
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
                    name="iswc"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <div className="flex items-center justify-between">
                          <FieldLabel>ISWC (Opcional)</FieldLabel>
                        </div>
                        <Input placeholder="Ej: T-034.524.680-1" {...field} value={field.value || ""} />
                        <p className="text-xs text-muted-foreground mt-1">
                          International Standard Musical Work Code
                        </p>
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
                          onSubGenreChange={(val) => setValue("subGenre", val, { shouldValidate: true })}
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
                  </div>
                </section>

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

              <aside className="space-y-8 lg:sticky lg:top-24 self-start">
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
                        </div>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </div>
                    )}
                  />
                </div>

                <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
                  <Button type="submit" className="w-full h-12 text-base font-semibold transition-all" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar Cambios"
                    )}
                  </Button>
                </div>
              </aside>
            </div>
          </div>
        </FieldGroup>
      </form>
    </FormProvider>
  );
}
