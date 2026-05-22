'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type {
  AdminStatsDto,
  AdminUserDto,
  AdminTrackDto,
  AdminGenreDto,
  AdminRequestDto,
  CreateAdminUserInput,
  PaginatedAdminUsers,
  PaginatedAdminTracks,
  PaginatedAdminGenres,
  PaginatedAdminRequests,
  UserFilters,
  TrackFilters,
} from '../types/admin.types'

export async function fetchAdminStats(): Promise<AdminStatsDto> {
  const client = await getServerApiClient()
  const response = await client.get<AdminStatsDto>(apiURLs.admin.stats)
  return response.data
}

export async function fetchAllUsers(
  page = 1,
  limit = 10,
  filters: UserFilters = {},
): Promise<PaginatedAdminUsers> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const params: Record<string, unknown> = { limit, offset }
  if (filters.search) params.search = filters.search
  if (filters.role) params.role = filters.role
  if (filters.isVerified !== undefined) params.isVerified = filters.isVerified
  const response = await client.get<PaginatedAdminUsers>(apiURLs.users.base, { params })
  return response.data
}

export async function fetchAllTracks(
  page = 1,
  limit = 10,
  filters: TrackFilters = {},
): Promise<PaginatedAdminTracks> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const params: Record<string, unknown> = { limit, offset }
  if (filters.title) params.title = filters.title
  if (filters.language) params.language = filters.language
  if (filters.isAvailable !== undefined) params.isAvailable = filters.isAvailable
  if (filters.isGospel !== undefined) params.isGospel = filters.isGospel
  if (filters.genreId) params.genreId = filters.genreId
  if (filters.subGenre) params.subGenre = filters.subGenre
  const response = await client.get<PaginatedAdminTracks>(apiURLs.tracks.base, { params })
  return response.data
}

export async function fetchAllGenres(page = 1, limit = 10): Promise<PaginatedAdminGenres> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const response = await client.get<PaginatedAdminGenres>(apiURLs.genres.base, {
    params: { limit, offset },
  })
  return response.data
}

export async function fetchAllRequests(page = 1, limit = 10): Promise<PaginatedAdminRequests> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const response = await client.get<PaginatedAdminRequests>(apiURLs.requestedTracks.base, {
    params: { limit, offset },
  })
  return response.data
}

export async function createAdminUser(input: CreateAdminUserInput): Promise<AdminUserDto> {
  const client = await getServerApiClient()
  const response = await client.post<AdminUserDto>(apiURLs.admin.createAdmin, input)
  return response.data
}
