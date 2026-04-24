'use client'

import { useQuery } from '@tanstack/react-query';
import { tracksService } from '../services/tracks.client';
import { TrackResponse, TracksResponseDto } from '@/src/domains/tracks/types/track.types';

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

export const trackHooks = {
  useFeaturedTracks,
  useTrackById,
  useMyTracks,
};



