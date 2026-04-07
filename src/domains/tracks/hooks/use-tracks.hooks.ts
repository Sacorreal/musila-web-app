'use client'

import { useQuery } from '@tanstack/react-query';
import { tracksService } from '../services/tracks.client';
import { TrackSummary } from '@/src/domains/tracks/types/track.type';

/**
 * Obtiene canciones destacadas desde el cliente (axios con token Zustand).
 * Intenta primero con ?limit=20; si el backend responde 500 reintenta sin parámetros.
 */
export function useFeaturedTracks() {
  return useQuery<TrackSummary[]>({
    queryKey: ['tracks', 'featured'],
    retry: false, // No reintentar automáticamente — controlamos el fallback localmente en Service
    queryFn: () => tracksService.getFeaturedTracks(),
  });
}

/**
 * Obtiene el detalle de una canción desde el cliente.
 */
export function useTrackById(id: string) {
  return useQuery<TrackSummary>({
    queryKey: ['tracks', id],
    queryFn: () => tracksService.fetchById(id),
    enabled: !!id,
  });
}

export const trackHooks = {
  useFeaturedTracks,
  useTrackById,
};



