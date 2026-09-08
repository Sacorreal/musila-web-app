'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Clock3, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/src/shared/components/UI/button';
import { Textarea } from '@/src/shared/components/UI/textarea';
import { Badge } from '@/src/shared/components/UI/badge';
import { Field, FieldError } from '@/src/shared/components/UI/field';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/src/shared/components/UI/alert-dialog';
import { formatSeconds } from '@/src/shared/libs/audioUtils';
import { usePlayerStore } from '@/src/domains/player/store/use-player-store';
import { updateTrackNoteFormSchema, UpdateTrackNoteFormValues } from '../track-notes.schema';
import { useDeleteTrackNote, useUpdateTrackNote } from '../track-notes.hooks';
import { TrackNote } from '../track-notes.types';

interface TrackNoteItemProps {
  note: TrackNote;
  trackId: string;
  playlistId?: string;
  showAuthor: boolean;
}

export function TrackNoteItem({ note, trackId, playlistId, showAuthor }: TrackNoteItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const requestSeek = usePlayerStore((state) => state.requestSeek);
  const updateNote = useUpdateTrackNote(trackId, playlistId);
  const deleteNote = useDeleteTrackNote(trackId, playlistId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<UpdateTrackNoteFormValues>({
    resolver: zodResolver(updateTrackNoteFormSchema),
    mode: 'onChange',
    defaultValues: { content: note.content },
  });

  const handleCancelEdit = () => {
    reset({ content: note.content });
    setIsEditing(false);
  };

  const onSubmitEdit = (values: UpdateTrackNoteFormValues) => {
    if (!values.content) return;
    updateNote.mutate(
      { id: note.id, input: { content: values.content } },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  return (
    <li className="group flex flex-col gap-2 rounded-xl border border-border/60 bg-muted/20 p-4 transition-colors hover:border-border">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {note.timestampSeconds !== null && (
            <button
              type="button"
              onClick={() => requestSeek(note.timestampSeconds as number)}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`Ir al minuto ${formatSeconds(note.timestampSeconds)} de la canción`}
            >
              <Clock3 className="w-3 h-3" aria-hidden="true" />
              {formatSeconds(note.timestampSeconds)}
            </button>
          )}
          {showAuthor && (
            <Badge variant="secondary" className="font-medium">
              {note.authorName}
            </Badge>
          )}
        </div>

        {note.isMine && !isEditing && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setIsEditing(true)}
              aria-label="Editar nota"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Eliminar nota"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar esta nota?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. La nota se eliminará permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleteNote.isPending}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteNote.mutate(note.id)}
                    disabled={deleteNote.isPending}
                    className="bg-destructive text-white hover:bg-destructive/90"
                  >
                    {deleteNote.isPending ? 'Eliminando...' : 'Eliminar'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmitEdit)} className="flex flex-col gap-2" noValidate>
          <Field data-invalid={!!errors.content}>
            <Textarea
              {...register('content')}
              rows={3}
              maxLength={2000}
              disabled={updateNote.isPending}
              autoFocus
              aria-invalid={!!errors.content}
            />
            {errors.content && <FieldError errors={[errors.content]} />}
          </Field>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancelEdit}
              disabled={updateNote.isPending}
            >
              <X className="w-3.5 h-3.5" /> Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={updateNote.isPending || !isValid}>
              <Check className="w-3.5 h-3.5" /> {updateNote.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{note.content}</p>
      )}
    </li>
  );
}
