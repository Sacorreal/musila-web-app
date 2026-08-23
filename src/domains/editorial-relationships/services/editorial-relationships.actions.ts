'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { EditorialRelationshipDto } from '../types/editorial-relationship.types'

export async function getMyEditorialRelationshipsAction(): Promise<EditorialRelationshipDto[]> {
  const client = await getServerApiClient()
  const response = await client.get<EditorialRelationshipDto[]>(apiURLs.editorialRelationships.mine)
  return response.data
}

export async function getOrganizationEditorialRelationshipsAction(
  organizationId: string,
): Promise<EditorialRelationshipDto[]> {
  const client = await getServerApiClient()
  const response = await client.get<EditorialRelationshipDto[]>(
    apiURLs.editorialRelationships.forOrganization(organizationId),
  )
  return response.data
}
