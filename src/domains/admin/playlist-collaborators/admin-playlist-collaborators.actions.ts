'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { AdminPlaylistCollaboratorDto } from './admin-playlist-collaborators.types'

export async function fetchPlaylistCollaborators(playlistId: string): Promise<AdminPlaylistCollaboratorDto[]> {
  const client = await getServerApiClient()
  const response = await client.get<AdminPlaylistCollaboratorDto[]>(apiURLs.playlistCollaborators.base(playlistId))
  return response.data
}
