'use client'

import { useQuery } from '@tanstack/react-query';
import { fetchFeaturedArtists, fetchArtistById } from '../services/artists.actions';

export function useFeaturedArtists() {
  return useQuery({
    queryKey: ['artists', 'featured'],
    queryFn: () => fetchFeaturedArtists(),
  });
}

export function useArtistById(id: string) {
  return useQuery({
    queryKey: ['artists', id],
    queryFn: () => fetchArtistById(id),
    enabled: !!id,
  });
}

export const artistHooks = {
  useFeaturedArtists,
  useArtistById,
};
