'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { AdminPlaylistDto, PaginatedAdminPlaylists } from './admin-playlists.types'

export async function fetchAdminPlaylists(page = 1, limit = 10): Promise<PaginatedAdminPlaylists> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const response = await client.get<PaginatedAdminPlaylists>(apiURLs.playlists.base, {
    params: { limit, offset },
  })
  return response.data
}

export async function fetchAdminPlaylistById(id: string): Promise<AdminPlaylistDto> {
  const client = await getServerApiClient()
  const response = await client.get<AdminPlaylistDto>(apiURLs.playlists.byId(id))
  return response.data
}
