'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Clock3 } from 'lucide-react';
import { Button } from '@/src/shared/components/UI/button';
import { Textarea } from '@/src/shared/components/UI/textarea';
import { Switch } from '@/src/shared/components/UI/switch';
import { Field, FieldError, FieldLabel } from '@/src/shared/components/UI/field';
import { usePlayerStore } from '@/src/domains/player/store/use-player-store';
import { formatSeconds } from '@/src/shared/libs/audioUtils';
import { trackNoteFormSchema, TrackNoteFormValues } from '../track-notes.schema';
import { useCreateTrackNote } from '../track-notes.hooks';

interface AddTrackNoteFormProps {
  trackId: string;
  playlistId?: string;
}

export function AddTrackNoteForm({ trackId, playlistId }: AddTrackNoteFormProps) {
  const currentTime = usePlayerStore((state) => state.currentTime);
  const [pinToCurrentTime, setPinToCurrentTime] = useState(false);
  const { mutate: createNote, isPending } = useCreateTrackNote(trackId, playlistId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<TrackNoteFormValues>({
    resolver: zodResolver(trackNoteFormSchema),
    mode: 'onChange',
    defaultValues: { content: '' },
  });

  const onSubmit = (values: TrackNoteFormValues) => {
    createNote(
      {
        trackId,
        playlistId,
        content: values.content,
        timestampSeconds: pinToCurrentTime ? Math.round(currentTime) : undefined,
      },
      {
        onSuccess: () => {
          reset({ content: '' });
          setPinToCurrentTime(false);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
      <Field data-invalid={!!errors.content}>
        <FieldLabel htmlFor="track-note-content" className="sr-only">
          Contenido de la nota
        </FieldLabel>
        <Textarea
          id="track-note-content"
          {...register('content')}
          rows={3}
          maxLength={2000}
          placeholder="Escribe una nota sobre esta canción..."
          disabled={isPending}
          aria-invalid={!!errors.content}
        />
        {errors.content && <FieldError errors={[errors.content]} />}
      </Field>

      <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
        <label
          htmlFor="pin-current-time"
          className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer select-none"
        >
          <Clock3 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          Anclar al minuto actual
          <span className="tabular-nums font-semibold text-foreground">{formatSeconds(currentTime)}</span>
        </label>
        <Switch
          id="pin-current-time"
          checked={pinToCurrentTime}
          onCheckedChange={setPinToCurrentTime}
          disabled={isPending}
          aria-label="Anclar nota al minuto actual de reproducción"
        />
      </div>

      <Button
        type="submit"
        size="sm"
        className="self-end rounded-full font-bold"
        disabled={isPending || !isValid}
      >
        {isPending ? 'Guardando...' : 'Agregar nota'}
      </Button>
    </form>
  );
}
