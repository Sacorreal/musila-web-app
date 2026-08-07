'use client'

import { apiClient } from '@shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type {
  OriginalWorkOrigin,
  PaginatedRegistrationFiles,
  RecordingType,
  RegistrationFileChecklistItem,
  RegistrationFileDto,
  RegistrationFileListQuery,
  RegistrationFileParticipantDto,
  RegistrationFileSummaryDto,
  RegistrationFileValidationResult,
  RegistrationProfileKey,
} from '../types/registration-file.types'

export async function fetchRegistrationFile(id: string): Promise<RegistrationFileDto> {
  const { data } = await apiClient.get<RegistrationFileDto>(apiURLs.registrationFile.byId(id))
  return data
}

export async function fetchRegistrationFileByTrack(trackId: string): Promise<RegistrationFileDto | null> {
  try {
    const { data } = await apiClient.get<RegistrationFileDto>(apiURLs.registrationFile.byTrack(trackId))
    return data
  } catch (error: any) {
    if (error?.response?.status === 404) return null
    throw error
  }
}

export async function fetchRegistrationFiles(
  query: RegistrationFileListQuery,
): Promise<PaginatedRegistrationFiles> {
  const { data } = await apiClient.get<PaginatedRegistrationFiles>(apiURLs.registrationFile.list, {
    params: query,
  })
  return data
}

export async function fetchRegistrationFileSummaries(
  trackIds: string[],
): Promise<Record<string, RegistrationFileSummaryDto>> {
  if (!trackIds.length) return {}
  const { data } = await apiClient.get<Record<string, RegistrationFileSummaryDto>>(
    apiURLs.registrationFile.summaryByTrackIds(trackIds),
  )
  return data
}

export async function createRegistrationFile(
  trackId: string,
  activeProfileKeys: RegistrationProfileKey[],
): Promise<RegistrationFileDto> {
  const { data } = await apiClient.post<RegistrationFileDto>(apiURLs.registrationFile.byTrack(trackId), {
    activeProfileKeys,
  })
  return data
}

export interface GeneralInfoPayload {
  title?: string
  alternativeTitles?: string[]
  language?: string
  ritmo?: string
  durationSeconds?: number
  creationDate?: string
  creationPlace?: string
  workState?: string
  version?: string
  description?: string
}

export async function updateGeneralInfo(id: string, payload: GeneralInfoPayload): Promise<RegistrationFileDto> {
  const { data } = await apiClient.patch<RegistrationFileDto>(apiURLs.registrationFile.generalInfo(id), payload)
  return data
}

export interface ParticipantInputPayload {
  splitAuthorId?: string
  fullName: string
  documentType?: string
  documentNumber?: string
  nationality?: string
  managementSociety?: string
  ipiCode?: string
  saycoCode?: string
  saycoIpName?: string
  role: string
  authorialPercentage: number
  mechanicalPercentage: number
}

export async function updateParticipants(
  id: string,
  participants: ParticipantInputPayload[],
): Promise<RegistrationFileDto> {
  const { data } = await apiClient.patch<RegistrationFileDto>(apiURLs.registrationFile.participants(id), {
    participants,
  })
  return data
}

export async function populateParticipantsFromSplit(id: string): Promise<RegistrationFileDto> {
  const { data } = await apiClient.post<RegistrationFileDto>(apiURLs.registrationFile.participantsFromSplit(id))
  return data
}

export interface PhonogramPayload {
  hasRecording: boolean
  recordingType?: RecordingType
  isrc?: string
  phonogramProducer?: string
  phonogramOwner?: string
  recordingDate?: string
}

export async function updatePhonogram(id: string, payload: PhonogramPayload): Promise<RegistrationFileDto> {
  const { data } = await apiClient.patch<RegistrationFileDto>(apiURLs.registrationFile.phonogram(id), payload)
  return data
}

export interface PublishingPayload {
  hasPublishingDeal: boolean
  publishingContractId?: string
  publishingAdministeredPercentage?: number
}

export async function updatePublishing(id: string, payload: PublishingPayload): Promise<RegistrationFileDto> {
  const { data } = await apiClient.patch<RegistrationFileDto>(apiURLs.registrationFile.publishing(id), payload)
  return data
}

export interface DerivativeWorkPayload {
  isDerivative: boolean
  originalWorkOrigin?: OriginalWorkOrigin
  iswc?: string
  preexistingWorkName?: string
  adaptationType?: string
}

export async function updateDerivativeWork(id: string, payload: DerivativeWorkPayload): Promise<RegistrationFileDto> {
  const { data } = await apiClient.patch<RegistrationFileDto>(apiURLs.registrationFile.derivativeWork(id), payload)
  return data
}

export interface CommissionedWorkPayload {
  isCommissioned: boolean
  contractingCompany?: string
  observations?: string
}

export async function updateCommissionedWork(id: string, payload: CommissionedWorkPayload): Promise<RegistrationFileDto> {
  const { data } = await apiClient.patch<RegistrationFileDto>(apiURLs.registrationFile.commissionedWork(id), payload)
  return data
}

export interface AiUsagePayload {
  usedAi: boolean
  toolUsed?: string
  participationLevel?: string
  observations?: string
}

export async function updateAiUsage(id: string, payload: AiUsagePayload): Promise<RegistrationFileDto> {
  const { data } = await apiClient.patch<RegistrationFileDto>(apiURLs.registrationFile.aiUsage(id), payload)
  return data
}

export interface AddDocumentPayload {
  documentType: string
  fileKey: string
  fileUrl: string
  fileName: string
  mimeType: string
  fileSizeBytes: number
}

export async function addDocument(id: string, payload: AddDocumentPayload): Promise<RegistrationFileDto['documents'][number]> {
  const { data } = await apiClient.post(apiURLs.registrationFile.documents(id), payload)
  return data
}

export async function removeDocument(id: string, documentId: string): Promise<void> {
  await apiClient.delete(apiURLs.registrationFile.documentById(id, documentId))
}

export async function fetchCompleteness(id: string): Promise<RegistrationFileValidationResult> {
  const { data } = await apiClient.get<RegistrationFileValidationResult>(apiURLs.registrationFile.completeness(id))
  return data
}

export async function fetchChecklist(id: string): Promise<RegistrationFileChecklistItem[]> {
  const { data } = await apiClient.get<RegistrationFileChecklistItem[]>(apiURLs.registrationFile.checklist(id))
  return data
}

export async function markReadyForSubmission(id: string): Promise<RegistrationFileDto> {
  const { data } = await apiClient.post<RegistrationFileDto>(apiURLs.registrationFile.readyForSubmission(id))
  return data
}

export async function markProfileSubmitted(id: string, profileKey: RegistrationProfileKey): Promise<void> {
  await apiClient.post(apiURLs.registrationFile.markProfileSubmitted(id, profileKey))
}

export async function markProfileRegistered(
  id: string,
  profileKey: RegistrationProfileKey,
  officialRegistryNumber: string,
  notes?: string,
): Promise<void> {
  await apiClient.post(apiURLs.registrationFile.markProfileRegistered(id, profileKey), {
    officialRegistryNumber,
    notes,
  })
}

export type { RegistrationFileParticipantDto }
