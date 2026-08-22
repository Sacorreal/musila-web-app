'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type {
  CreateSocietyAffiliationInput,
  EndSocietyAffiliationInput,
  SocietyAffiliationDto,
  UpdateSocietyAffiliationInput,
} from './society-affiliations.types'

export async function createSocietyAffiliation(
  authorId: string,
  input: CreateSocietyAffiliationInput,
): Promise<SocietyAffiliationDto> {
  const response = await apiClient.post<SocietyAffiliationDto>(apiURLs.societyAffiliations.base(authorId), input)
  return response.data
}

export async function updateSocietyAffiliation(
  authorId: string,
  affiliationId: string,
  input: UpdateSocietyAffiliationInput,
): Promise<SocietyAffiliationDto> {
  const response = await apiClient.patch<SocietyAffiliationDto>(
    apiURLs.societyAffiliations.byId(authorId, affiliationId),
    input,
  )
  return response.data
}

export async function endSocietyAffiliation(
  authorId: string,
  affiliationId: string,
  input: EndSocietyAffiliationInput = {},
): Promise<SocietyAffiliationDto> {
  const response = await apiClient.post<SocietyAffiliationDto>(apiURLs.societyAffiliations.end(authorId, affiliationId), input)
  return response.data
}
