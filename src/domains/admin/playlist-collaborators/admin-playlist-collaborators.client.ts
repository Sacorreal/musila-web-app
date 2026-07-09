'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type { AddCollaboratorAdminInput, AdminPlaylistCollaboratorDto } from './admin-playlist-collaborators.types'

export async function addCollaborator(
  playlistId: string,
  input: AddCollaboratorAdminInput,
): Promise<AdminPlaylistCollaboratorDto> {
  const response = await apiClient.post<AdminPlaylistCollaboratorDto>(
    apiURLs.playlistCollaborators.base(playlistId),
    input,
  )
  return response.data
}

export async function removeCollaborator(playlistId: string, guestId: string): Promise<void> {
  await apiClient.delete(apiURLs.playlistCollaborators.byId(playlistId, guestId))
}
