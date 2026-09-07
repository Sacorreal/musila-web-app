'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type { AdminUserDto } from '../types/admin.types'
import type { UpdateUserProfileInput } from './admin-user-profile.types'

export async function updateUserProfile(id: string, input: UpdateUserProfileInput): Promise<AdminUserDto> {
  const response = await apiClient.put<AdminUserDto>(apiURLs.users.userById(id), input)
  return response.data
}
