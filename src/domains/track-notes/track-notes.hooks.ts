'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/src/domains/auth/store/use-auth-store';
import {
  createTrackNoteAction,
  deleteTrackNoteAction,
  getTrackNotesAction,
  updateTrackNoteAction,
} from './track-notes.actions';
import { CreateTrackNoteInput, TrackNote, TrackNoteDto, UpdateTrackNoteInput } from './track-notes.types';

const trackNotesKey = (trackId: string, playlistId?: string) =>
  ['track-notes', trackId, playlistId ?? 'private'] as const;

function withIsMine(note: TrackNoteDto, currentUserId?: string): TrackNote {
  return { ...note, isMine: Boolean(currentUserId) && note.authorId === currentUserId };
}

/**
 * Notas de un track. Sin `playlistId` trae solo las notas privadas del
 * usuario actual; con `playlistId` trae todas las notas compartidas de esa
 * playlist. `isMine` se deriva en el cliente comparando `authorId` contra la
 * identidad autenticada actual (usuario o guest, ambos viven en el mismo
 * `useAuthStore`).
 */
export function useTrackNotes(trackId: string, playlistId?: string) {
  const currentUserId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: trackNotesKey(trackId, playlistId),
    queryFn: () => getTrackNotesAction(trackId, playlistId),
    enabled: Boolean(trackId),
    select: (notes) => notes.map((note) => withIsMine(note, currentUserId)),
  });
}

export function useCreateTrackNote(trackId: string, playlistId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTrackNoteInput) => createTrackNoteAction(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: trackNotesKey(trackId, playlistId) });
      toast.success('Nota guardada');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'No se pudo guardar la nota');
    },
  });
}

export function useUpdateTrackNote(trackId: string, playlistId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTrackNoteInput }) =>
      updateTrackNoteAction(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: trackNotesKey(trackId, playlistId) });
      toast.success('Nota actualizada');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'No se pudo actualizar la nota');
    },
  });
}

export function useDeleteTrackNote(trackId: string, playlistId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTrackNoteAction(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: trackNotesKey(trackId, playlistId) });
      toast.success('Nota eliminada');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'No se pudo eliminar la nota');
    },
  });
}
