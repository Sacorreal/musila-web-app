import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import { PaginatedResponse } from '@shared/types/shared.types'
import type { AdminEntityOption } from './AdminEntitySelect'
import type { AdminUserRefDto } from './admin-shared.types'

export async function fetchUserOptions(query: string): Promise<AdminEntityOption[]> {
  const response = await apiClient.get<PaginatedResponse<AdminUserRefDto>>(apiURLs.users.base, {
    params: { search: query, limit: 20, offset: 0 },
  })
  return response.data.data.map((u) => ({
    value: u.id,
    label: `${u.name} ${u.lastName}`,
    description: u.email,
  }))
}

export async function fetchTrackOptions(query: string): Promise<AdminEntityOption[]> {
  const response = await apiClient.get<PaginatedResponse<{ id: string; title: string }>>(apiURLs.tracks.base, {
    params: { title: query, limit: 20, offset: 0 },
  })
  return response.data.data.map((t) => ({ value: t.id, label: t.title }))
}

export async function fetchGuestOptions(query: string): Promise<AdminEntityOption[]> {
  const response = await apiClient.get<PaginatedResponse<{ id: string; name: string; lastName: string; email: string }>>(
    apiURLs.guests.base,
    { params: { search: query, limit: 20, offset: 0 } },
  )
  return response.data.data.map((g) => ({ value: g.id, label: `${g.name} ${g.lastName}`, description: g.email }))
}
