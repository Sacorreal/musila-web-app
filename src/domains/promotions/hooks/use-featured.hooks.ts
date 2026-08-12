'use client'

import { useQuery } from '@tanstack/react-query'
import { featuredClient } from '../services/featured.client'

/** Tracks destacados vigentes (máx. 10). Refresca cada minuto. */
export function useFeaturedTracks() {
  return useQuery({
    queryKey: ['featured', 'tracks'],
    queryFn: featuredClient.getTracks,
    staleTime: 60_000,
  })
}

/** Compositores destacados vigentes (máx. 5). */
export function useFeaturedComposers() {
  return useQuery({
    queryKey: ['featured', 'composers'],
    queryFn: featuredClient.getComposers,
    staleTime: 60_000,
  })
}
