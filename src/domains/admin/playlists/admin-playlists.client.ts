'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type { AdminPlaylistDto, CreatePlaylistAdminInput, UpdatePlaylistAdminInput } from './admin-playlists.types'

export async function createPlaylist(input: CreatePlaylistAdminInput): Promise<AdminPlaylistDto> {
  const response = await apiClient.post<AdminPlaylistDto>(apiURLs.playlists.base, input)
  return response.data
}

export async function updatePlaylist(id: string, input: UpdatePlaylistAdminInput): Promise<AdminPlaylistDto> {
  const response = await apiClient.put<AdminPlaylistDto>(apiURLs.playlists.byId(id), input)
  return response.data
}

export async function deletePlaylist(id: string): Promise<void> {
  await apiClient.delete(apiURLs.playlists.byId(id))
}
