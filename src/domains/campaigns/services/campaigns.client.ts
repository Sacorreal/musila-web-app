'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type { LicenseType } from '@/src/domains/tracks/types/track.types'
import type {
  Campaign,
  CampaignSubmission,
  CreateCampaignInput,
  MatchingTrack,
  PaginatedCampaigns,
} from '../types/campaigns.types'

/**
 * Acceso a la API de campañas desde el navegador. `apiClient` adjunta
 * automáticamente el header `x-organization-id` cuando hay una organización
 * activa; si no la hay, la campaña es personal del usuario autenticado (el
 * backend valida la membership real, o la pertenencia personal, en ambos
 * casos).
 */
export const campaignsClient = {
  listPublic: async (): Promise<PaginatedCampaigns> => {
    const { data } = await apiClient.get<PaginatedCampaigns>(apiURLs.campaigns.base)
    return data
  },

  getById: async (id: string): Promise<Campaign> => {
    const { data } = await apiClient.get<Campaign>(apiURLs.campaigns.byId(id))
    return data
  },

  getByToken: async (token: string): Promise<Campaign> => {
    const { data } = await apiClient.get<Campaign>(apiURLs.campaigns.byToken(token))
    return data
  },

  getMine: async (): Promise<PaginatedCampaigns> => {
    const { data } = await apiClient.get<PaginatedCampaigns>(apiURLs.campaigns.mine)
    return data
  },

  create: async (input: CreateCampaignInput): Promise<Campaign> => {
    const { data } = await apiClient.post<Campaign>(apiURLs.campaigns.base, input)
    return data
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(apiURLs.campaigns.byId(id))
  },

  getMatchingTracks: async (id: string): Promise<MatchingTrack[]> => {
    const { data } = await apiClient.get<MatchingTrack[]>(apiURLs.campaigns.matchingTracks(id))
    return data
  },

  submit: async (id: string, trackId: string): Promise<CampaignSubmission> => {
    const { data } = await apiClient.post<CampaignSubmission>(apiURLs.campaigns.submissions(id), { trackId })
    return data
  },

  getSubmissions: async (id: string): Promise<CampaignSubmission[]> => {
    const { data } = await apiClient.get<CampaignSubmission[]>(apiURLs.campaigns.submissions(id))
    return data
  },

  selectSubmission: async (
    id: string,
    submissionId: string,
    licenseType: LicenseType,
  ): Promise<CampaignSubmission> => {
    const { data } = await apiClient.patch<CampaignSubmission>(
      apiURLs.campaigns.selectSubmission(id, submissionId),
      { licenseType },
    )
    return data
  },

  discardSubmission: async (id: string, submissionId: string): Promise<CampaignSubmission> => {
    const { data } = await apiClient.patch<CampaignSubmission>(
      apiURLs.campaigns.discardSubmission(id, submissionId),
    )
    return data
  },
}
