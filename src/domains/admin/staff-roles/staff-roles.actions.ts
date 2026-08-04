'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type {
  PaginatedStaffRoles,
  StaffPermissionsByModule,
  StaffRoleDto,
  StaffRoleFilters,
} from './staff-roles.types'

export async function fetchStaffPermissions(): Promise<StaffPermissionsByModule> {
  const client = await getServerApiClient()
  const response = await client.get<StaffPermissionsByModule>(apiURLs.staff.permissions)
  return response.data
}

export async function fetchStaffRoles(
  page = 1,
  limit = 20,
  filters: StaffRoleFilters = {},
): Promise<PaginatedStaffRoles> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const params: Record<string, unknown> = { limit, offset }
  if (filters.search) params.search = filters.search
  const response = await client.get<PaginatedStaffRoles>(apiURLs.staff.roles.base, { params })
  return response.data
}

export async function fetchStaffRoleById(id: string): Promise<StaffRoleDto> {
  const client = await getServerApiClient()
  const response = await client.get<StaffRoleDto>(apiURLs.staff.roles.byId(id))
  return response.data
}
