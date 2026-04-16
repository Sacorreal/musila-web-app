'use client'

import { useQuery } from '@tanstack/react-query';
import { tracksService } from '../services/tracks.client';
import { TrackResponse, TrackDetailResponse } from '@/src/domains/tracks/types/track.types';

/**
 * Obtiene canciones destacadas desde el cliente (axios con token Zustand).
 * Intenta primero con ?limit=20; si el backend responde 500 reintenta sin parámetros.
 */
export function useFeaturedTracks() {
  return useQuery<TrackResponse[]>({
    queryKey: ['tracks', 'featured'],
    retry: false, // No reintentar automáticamente — controlamos el fallback localmente en Service
    queryFn: () => tracksService.getFeaturedTracks(),
  });
}

/**
 * Obtiene el detalle de una canción desde el cliente.
 */
export function useTrackById(id: string) {
  return useQuery<TrackDetailResponse>({
    queryKey: ['tracks', id],
    queryFn: () => tracksService.getById(id),
    enabled: !!id,
  });
}

export const trackHooks = {
  useFeaturedTracks,
  useTrackById,
};



