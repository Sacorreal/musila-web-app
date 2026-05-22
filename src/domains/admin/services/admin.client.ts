'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import { UserRole } from '@/src/domains/users/types/user.types'
import type { AdminGenreDto, CreateGenreInput, UpdateGenreInput } from '../types/admin.types'

export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(apiURLs.users.userById(id))
}

export async function updateUserRole(id: string, role: UserRole): Promise<void> {
  await apiClient.put(apiURLs.users.userById(id), { role })
}

export async function deleteTrack(id: string): Promise<void> {
  await apiClient.delete(apiURLs.tracks.byId(id))
}

export async function deleteGenre(id: string): Promise<void> {
  await apiClient.delete(apiURLs.genres.byId(id))
}

export async function createGenre(input: CreateGenreInput): Promise<AdminGenreDto> {
  const response = await apiClient.post<AdminGenreDto>(apiURLs.genres.base, input)
  return response.data
}

export async function updateGenre(id: string, input: UpdateGenreInput): Promise<AdminGenreDto> {
  const response = await apiClient.put<AdminGenreDto>(apiURLs.genres.byId(id), input)
  return response.data
}
