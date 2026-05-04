'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tracksService } from '../services/tracks.client';
import { TrackResponse, TracksResponseDto, UpdateTrackInput } from '@/src/domains/tracks/types/track.types';
import { toast } from 'sonner';

/**
 * Obtiene canciones destacadas desde el cliente (axios con token Zustand).
 * Intenta primero con ?limit=20; si el backend responde 500 reintenta sin parámetros.
 */
export function useFeaturedTracks() {
  return useQuery<TracksResponseDto[]>({
    queryKey: ['tracks', 'featured'],
    retry: false, // No reintentar automáticamente — controlamos el fallback localmente en Service
    queryFn: () => tracksService.getFeaturedTracks(),
  });
}

/**
 * Obtiene el detalle de una canción desde el cliente.
 */
export function useTrackById(id: string) {
  return useQuery<TrackResponse>({
    queryKey: ['tracks', id],
    queryFn: () => tracksService.getById(id),
    enabled: !!id,
  });
}

/**
 * Obtiene las canciones del usuario logueado.
 */
export function useMyTracks() {
  return useQuery<TrackResponse[]>({
    queryKey: ['tracks', 'me'],
    queryFn: () => tracksService.getMyTracks(),
  });
}

/**
 * Hook para actualizar una canción.
 */
export function useUpdateTrack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTrackInput }) => 
      tracksService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracks'] });
      toast.success("Canción actualizada correctamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al actualizar la canción");
    }
  });
}

export const trackHooks = {
  useFeaturedTracks,
  useTrackById,
  useMyTracks,
  useUpdateTrack,
};



