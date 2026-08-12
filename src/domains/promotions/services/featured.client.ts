'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type { FeaturedComposer, FeaturedTrack } from '../types/promotions.types'

/** Lectura pública de los destacados (tracks y compositores pautados vigentes). */
export const featuredClient = {
  getTracks: async (): Promise<FeaturedTrack[]> => {
    const { data } = await apiClient.get<FeaturedTrack[]>(apiURLs.featured.tracks)
    return data
  },
  getComposers: async (): Promise<FeaturedComposer[]> => {
    const { data } = await apiClient.get<FeaturedComposer[]>(apiURLs.featured.composers)
    return data
  },
}
