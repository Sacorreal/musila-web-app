'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type { AdminRequestDto } from '../types/admin.types'
import type { UpdateRequestedTrackAdminInput } from './admin-requested-tracks.types'

export async function updateRequestedTrack(
  id: string,
  input: UpdateRequestedTrackAdminInput,
): Promise<AdminRequestDto> {
  const response = await apiClient.put<AdminRequestDto>(apiURLs.requestedTracks.byId(id), input)
  return response.data
}

export async function deleteRequestedTrack(id: string): Promise<void> {
  await apiClient.delete(apiURLs.requestedTracks.byId(id))
}
