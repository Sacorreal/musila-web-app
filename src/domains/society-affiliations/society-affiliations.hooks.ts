'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuthStore } from '@/src/domains/auth/store/use-auth-store'
import { fetchCollectiveManagementSocieties, fetchSocietyAffiliations } from './society-affiliations.actions'
import { createSocietyAffiliation, endSocietyAffiliation, updateSocietyAffiliation } from './society-affiliations.client'
import type {
  CreateSocietyAffiliationInput,
  EndSocietyAffiliationInput,
  UpdateSocietyAffiliationInput,
} from './society-affiliations.types'

const SOCIETY_AFFILIATIONS_KEY = ['society-affiliations'] as const

/** ID del autor autenticado — las afiliaciones son siempre self-service (§12: solo el propio autor). */
export function useCurrentAuthorId(): string | null {
  return useAuthStore((state) => state.user?.id ?? null)
}

export function useSocietyAffiliations() {
  const authorId = useCurrentAuthorId()

  return useQuery({
    queryKey: [...SOCIETY_AFFILIATIONS_KEY, authorId],
    queryFn: () => fetchSocietyAffiliations(authorId as string),
    enabled: !!authorId,
  })
}

export function useCollectiveManagementSocieties(search?: string) {
  return useQuery({
    queryKey: ['collective-management-societies', search ?? ''],
    queryFn: () => fetchCollectiveManagementSocieties(search),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateSocietyAffiliation() {
  const qc = useQueryClient()
  const authorId = useCurrentAuthorId()

  return useMutation({
    mutationFn: (input: CreateSocietyAffiliationInput) => createSocietyAffiliation(authorId as string, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SOCIETY_AFFILIATIONS_KEY })
      toast.success('Afiliación creada')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'No se pudo crear la afiliación'),
  })
}

export function useUpdateSocietyAffiliation() {
  const qc = useQueryClient()
  const authorId = useCurrentAuthorId()

  return useMutation({
    mutationFn: ({ affiliationId, input }: { affiliationId: string; input: UpdateSocietyAffiliationInput }) =>
      updateSocietyAffiliation(authorId as string, affiliationId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SOCIETY_AFFILIATIONS_KEY })
      toast.success('Afiliación actualizada')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'No se pudo actualizar la afiliación'),
  })
}

export function useEndSocietyAffiliation() {
  const qc = useQueryClient()
  const authorId = useCurrentAuthorId()

  return useMutation({
    mutationFn: ({ affiliationId, input }: { affiliationId: string; input?: EndSocietyAffiliationInput }) =>
      endSocietyAffiliation(authorId as string, affiliationId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SOCIETY_AFFILIATIONS_KEY })
      toast.success('Afiliación finalizada')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'No se pudo finalizar la afiliación'),
  })
}
