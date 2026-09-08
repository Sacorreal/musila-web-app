'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { LicenseType } from '@/src/domains/tracks/types/track.types'
import { campaignsClient } from '../services/campaigns.client'
import type { CreateCampaignInput } from '../types/campaigns.types'

const KEYS = {
  public: ['campaigns', 'public'] as const,
  mine: ['campaigns', 'mine'] as const,
  byId: (id: string) => ['campaigns', 'detail', id] as const,
  byToken: (token: string) => ['campaigns', 'token', token] as const,
  matchingTracks: (id: string) => ['campaigns', id, 'matching-tracks'] as const,
  submissions: (id: string) => ['campaigns', id, 'submissions'] as const,
}

export function usePublicCampaigns() {
  return useQuery({ queryKey: KEYS.public, queryFn: campaignsClient.listPublic })
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: KEYS.byId(id),
    queryFn: () => campaignsClient.getById(id),
    enabled: !!id,
  })
}

export function useCampaignByToken(token: string) {
  return useQuery({
    queryKey: KEYS.byToken(token),
    queryFn: () => campaignsClient.getByToken(token),
    enabled: !!token,
  })
}

export function useMyCampaigns() {
  return useQuery({ queryKey: KEYS.mine, queryFn: campaignsClient.getMine })
}

export function useMatchingTracks(campaignId: string) {
  return useQuery({
    queryKey: KEYS.matchingTracks(campaignId),
    queryFn: () => campaignsClient.getMatchingTracks(campaignId),
    enabled: !!campaignId,
  })
}

export function useCampaignSubmissions(campaignId: string) {
  return useQuery({
    queryKey: KEYS.submissions(campaignId),
    queryFn: () => campaignsClient.getSubmissions(campaignId),
    enabled: !!campaignId,
  })
}

export function useCreateCampaign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCampaignInput) => campaignsClient.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.mine })
      toast.success('Campaña creada')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'No se pudo crear la campaña'),
  })
}

export function useRemoveCampaign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => campaignsClient.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.mine })
      toast.success('Campaña eliminada del historial')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'No se pudo eliminar la campaña'),
  })
}

export function useSubmitToCampaign(campaignId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (trackId: string) => campaignsClient.submit(campaignId, trackId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.matchingTracks(campaignId) })
      toast.success('Canción postulada a la campaña')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'No se pudo postular la canción'),
  })
}

export function useSelectSubmission(campaignId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ submissionId, licenseType }: { submissionId: string; licenseType: LicenseType }) =>
      campaignsClient.selectSubmission(campaignId, submissionId, licenseType),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.submissions(campaignId) })
      qc.invalidateQueries({ queryKey: KEYS.mine })
      toast.success('Postulación aprobada: se inició el proceso de licenciamiento')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'No se pudo aprobar la postulación'),
  })
}

export function useDiscardSubmission(campaignId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (submissionId: string) => campaignsClient.discardSubmission(campaignId, submissionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.submissions(campaignId) })
      toast.success('Postulación descartada')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'No se pudo descartar la postulación'),
  })
}

export const campaignsHooks = {
  usePublicCampaigns,
  useCampaign,
  useCampaignByToken,
  useMyCampaigns,
  useMatchingTracks,
  useCampaignSubmissions,
  useCreateCampaign,
  useRemoveCampaign,
  useSubmitToCampaign,
  useSelectSubmission,
  useDiscardSubmission,
  KEYS,
}
