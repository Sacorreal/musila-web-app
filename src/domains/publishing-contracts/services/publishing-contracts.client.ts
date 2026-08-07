'use client'

import { apiClient } from '@shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type {
  CreatePublishingContractInput,
  PublishingContractDto,
  UpdatePublishingContractInput,
} from '../types/publishing-contract.types'

export async function fetchMyPublishingContracts(): Promise<PublishingContractDto[]> {
  const response = await apiClient.get<PublishingContractDto[]>(apiURLs.publishingContracts.mine)
  return response.data
}

export async function createPublishingContract(input: CreatePublishingContractInput): Promise<PublishingContractDto> {
  const response = await apiClient.post<PublishingContractDto>(apiURLs.publishingContracts.base, input)
  return response.data
}

export async function updatePublishingContract(
  id: string,
  input: UpdatePublishingContractInput,
): Promise<PublishingContractDto> {
  const response = await apiClient.patch<PublishingContractDto>(apiURLs.publishingContracts.byId(id), input)
  return response.data
}

export async function deletePublishingContract(id: string): Promise<void> {
  await apiClient.delete(apiURLs.publishingContracts.byId(id))
}
