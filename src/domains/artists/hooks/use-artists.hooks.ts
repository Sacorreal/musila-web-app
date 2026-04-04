'use client'

import { useQuery } from '@tanstack/react-query';
import { fetchFeaturedArtists } from '../services/artists.actions';

export function useFeaturedArtists() {
  return useQuery({
    queryKey: ['artists', 'featured'],
    queryFn: () => fetchFeaturedArtists(),
  });
}
