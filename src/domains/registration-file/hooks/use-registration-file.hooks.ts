'use client'

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as client from '../services/registration-file.client'
import type { RegistrationFileListQuery, RegistrationProfileKey } from '../types/registration-file.types'

const keys = {
  detail: (id: string) => ['registration-file', id] as const,
  completeness: (id: string) => ['registration-file', id, 'completeness'] as const,
}

function onErrorToast(fallback: string) {
  return (error: any) => toast.error(error?.response?.data?.message ?? fallback)
}

export function useRegistrationFile(id: string, enabled = true) {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: () => client.fetchRegistrationFile(id),
    enabled: !!id && enabled,
  })
}

export function useRegistrationFileByTrack(trackId: string, enabled = true) {
  return useQuery({
    queryKey: ['registration-file', 'by-track', trackId],
    queryFn: () => client.fetchRegistrationFileByTrack(trackId),
    enabled: !!trackId && enabled,
  })
}

export function useRegistrationFiles(query: RegistrationFileListQuery) {
  return useQuery({
    queryKey: ['registration-file', 'list', query] as const,
    queryFn: () => client.fetchRegistrationFiles(query),
    placeholderData: keepPreviousData,
  })
}

export function useRegistrationFileSummaries(trackIds: string[]) {
  const sortedIds = [...trackIds].sort()
  return useQuery({
    queryKey: ['registration-file', 'summaries', sortedIds] as const,
    queryFn: () => client.fetchRegistrationFileSummaries(sortedIds),
    enabled: sortedIds.length > 0,
  })
}

export function useCompleteness(id: string, enabled = true) {
  return useQuery({
    queryKey: keys.completeness(id),
    queryFn: () => client.fetchCompleteness(id),
    enabled: !!id && enabled,
  })
}

function useRegistrationFileMutation<TPayload>(
  mutationFn: (id: string, payload: TPayload) => Promise<unknown>,
  errorFallback: string,
) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TPayload }) => mutationFn(id, payload),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: keys.detail(id) })
      qc.invalidateQueries({ queryKey: keys.completeness(id) })
    },
    onError: onErrorToast(errorFallback),
  })
}

export function useCreateRegistrationFile() {
  return useMutation({
    mutationFn: ({ trackId, activeProfileKeys }: { trackId: string; activeProfileKeys: RegistrationProfileKey[] }) =>
      client.createRegistrationFile(trackId, activeProfileKeys),
    onError: onErrorToast('No se pudo crear el expediente de registro'),
  })
}

export const useUpdateGeneralInfo = () =>
  useRegistrationFileMutation(client.updateGeneralInfo, 'No se pudo guardar la información general')

export const useUpdatePhonogram = () =>
  useRegistrationFileMutation(client.updatePhonogram, 'No se pudo guardar el fonograma')

export const useUpdatePublishing = () =>
  useRegistrationFileMutation(client.updatePublishing, 'No se pudo guardar la información editorial')

export const useUpdateDerivativeWork = () =>
  useRegistrationFileMutation(client.updateDerivativeWork, 'No se pudo guardar la obra derivada')

export const useUpdateCommissionedWork = () =>
  useRegistrationFileMutation(client.updateCommissionedWork, 'No se pudo guardar la obra por encargo')

export const useUpdateAiUsage = () =>
  useRegistrationFileMutation(client.updateAiUsage, 'No se pudo guardar la información de IA')

export function useUpdateParticipants() {
  return useRegistrationFileMutation(client.updateParticipants, 'No se pudieron guardar los participantes')
}

export function usePopulateParticipantsFromSplit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => client.populateParticipantsFromSplit(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: keys.detail(id) })
      qc.invalidateQueries({ queryKey: keys.completeness(id) })
      toast.success('Participantes autocompletados desde el split')
    },
    onError: onErrorToast('Este track no tiene un split de coautoría registrado'),
  })
}

export function useAddDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: client.AddDocumentPayload }) => client.addDocument(id, payload),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: keys.detail(id) })
      qc.invalidateQueries({ queryKey: keys.completeness(id) })
    },
    onError: onErrorToast('No se pudo registrar el documento'),
  })
}

export function useRemoveDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, documentId }: { id: string; documentId: string }) => client.removeDocument(id, documentId),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: keys.detail(id) })
      qc.invalidateQueries({ queryKey: keys.completeness(id) })
    },
    onError: onErrorToast('No se pudo eliminar el documento'),
  })
}

export function useMarkReadyForSubmission() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => client.markReadyForSubmission(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: keys.detail(id) })
      qc.invalidateQueries({ queryKey: keys.completeness(id) })
      toast.success('¡Expediente listo para presentar!')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'El expediente todavía no está listo para presentar'),
  })
}

export function useMarkProfileSubmitted() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, profileKey }: { id: string; profileKey: RegistrationProfileKey }) =>
      client.markProfileSubmitted(id, profileKey),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: keys.detail(id) })
      toast.success('Perfil marcado como presentado')
    },
    onError: onErrorToast('No se pudo actualizar el estado del perfil'),
  })
}

export function useMarkProfileRegistered() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      profileKey,
      officialRegistryNumber,
      notes,
    }: {
      id: string
      profileKey: RegistrationProfileKey
      officialRegistryNumber: string
      notes?: string
    }) => client.markProfileRegistered(id, profileKey, officialRegistryNumber, notes),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: keys.detail(id) })
      toast.success('Perfil marcado como registrado')
    },
    onError: onErrorToast('No se pudo actualizar el estado del perfil'),
  })
}
