'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type { AdminGuestDto, CreateGuestAdminInput, UpdateGuestAdminInput } from './admin-guests.types'

export async function createGuest(input: CreateGuestAdminInput): Promise<AdminGuestDto> {
  const response = await apiClient.post<AdminGuestDto>(apiURLs.guests.base, input)
  return response.data
}

export async function updateGuest(id: string, input: UpdateGuestAdminInput): Promise<AdminGuestDto> {
  const response = await apiClient.put<AdminGuestDto>(apiURLs.guests.byId(id), input)
  return response.data
}

export async function deleteGuest(id: string): Promise<void> {
  await apiClient.delete(apiURLs.guests.byId(id))
}
