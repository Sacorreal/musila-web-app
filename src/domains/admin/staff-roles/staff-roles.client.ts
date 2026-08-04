'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type { CreateStaffRoleInput, StaffRoleDto, UpdateStaffRoleInput } from './staff-roles.types'

export async function createStaffRole(input: CreateStaffRoleInput): Promise<StaffRoleDto> {
  const response = await apiClient.post<StaffRoleDto>(apiURLs.staff.roles.base, input)
  return response.data
}

export async function updateStaffRole(id: string, input: UpdateStaffRoleInput): Promise<StaffRoleDto> {
  const response = await apiClient.patch<StaffRoleDto>(apiURLs.staff.roles.byId(id), input)
  return response.data
}

export async function deleteStaffRole(id: string): Promise<void> {
  await apiClient.delete(apiURLs.staff.roles.byId(id))
}
