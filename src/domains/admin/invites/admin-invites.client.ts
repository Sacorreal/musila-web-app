'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type { CreateInviteAdminInput } from './admin-invites.types'

export async function createInvite(input: CreateInviteAdminInput) {
  const response = await apiClient.post(apiURLs.invites.base, input)
  return response.data
}

export async function revokeInvite(id: string): Promise<void> {
  await apiClient.delete(apiURLs.invites.admin.byId(id))
}
