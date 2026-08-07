'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { PublishingContractDto } from '../types/publishing-contract.types'

export async function fetchMyPublishingContracts(): Promise<PublishingContractDto[]> {
  const client = await getServerApiClient()
  const response = await client.get<PublishingContractDto[]>(apiURLs.publishingContracts.mine)
  return response.data
}
