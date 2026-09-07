'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { PaginatedResponse } from '@shared/types/shared.types'
import type { CollectiveManagementSocietyDto, SocietyAffiliationDto } from './society-affiliations.types'

export async function fetchSocietyAffiliations(authorId: string): Promise<SocietyAffiliationDto[]> {
  const client = await getServerApiClient()
  const response = await client.get<SocietyAffiliationDto[]>(apiURLs.societyAffiliations.base(authorId))
  return response.data
}

export async function fetchCollectiveManagementSocieties(
  search?: string,
): Promise<PaginatedResponse<CollectiveManagementSocietyDto>> {
  const client = await getServerApiClient()
  const response = await client.get<PaginatedResponse<CollectiveManagementSocietyDto>>(
    apiURLs.referenceData.collectiveManagementSocieties.base,
    { params: { limit: 200, offset: 0, search } },
  )
  return response.data
}
