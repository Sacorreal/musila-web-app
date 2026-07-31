'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import { UserPlanType, MusicRole } from '@/src/domains/users/types/user.types'
import type {
  AdminGenreDto,
  CreateGenreInput,
  UpdateGenreInput,
  AdminMoodDto,
  CreateMoodInput,
  UpdateMoodInput,
  AdminThemeDto,
  CreateThemeInput,
  UpdateThemeInput,
} from '../types/admin.types'

export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(apiURLs.users.userById(id))
}

export async function updatePlanType(id: string, planType: UserPlanType): Promise<void> {
  await apiClient.put(apiURLs.users.userById(id), { planType })
}

export async function updateUserMusicRole(id: string, role: MusicRole): Promise<void> {
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

export async function deleteMood(id: string): Promise<void> {
  await apiClient.delete(apiURLs.moods.byId(id))
}

export async function createMood(input: CreateMoodInput): Promise<AdminMoodDto> {
  const response = await apiClient.post<AdminMoodDto>(apiURLs.moods.base, input)
  return response.data
}

export async function updateMood(id: string, input: UpdateMoodInput): Promise<AdminMoodDto> {
  const response = await apiClient.put<AdminMoodDto>(apiURLs.moods.byId(id), input)
  return response.data
}

export async function deleteTheme(id: string): Promise<void> {
  await apiClient.delete(apiURLs.themes.byId(id))
}

export async function createTheme(input: CreateThemeInput): Promise<AdminThemeDto> {
  const response = await apiClient.post<AdminThemeDto>(apiURLs.themes.base, input)
  return response.data
}

export async function updateTheme(id: string, input: UpdateThemeInput): Promise<AdminThemeDto> {
  const response = await apiClient.put<AdminThemeDto>(apiURLs.themes.byId(id), input)
  return response.data
}
