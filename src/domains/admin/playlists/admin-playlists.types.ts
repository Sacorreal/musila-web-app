import { PaginatedResponse } from '@shared/types/shared.types'

export interface AdminPlaylistDto {
  id: string
  title: string
  cover?: string | null
  owner?: { id: string; name: string; lastName: string; email: string }
  collaborators?: { id: string }[]
  tracks?: { id: string; title: string }[]
  createdAt: string
  updatedAt: string
}

export interface CreatePlaylistAdminInput {
  title: string
  ownerId: string
}

export interface UpdatePlaylistAdminInput {
  title?: string
}

export type PaginatedAdminPlaylists = PaginatedResponse<AdminPlaylistDto>
