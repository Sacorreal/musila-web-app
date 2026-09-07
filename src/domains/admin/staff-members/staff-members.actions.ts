'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { MyStaffPermissions, PaginatedStaffMembers, StaffMemberFilters } from './staff-members.types'

export async function fetchStaffMembers(
  page = 1,
  limit = 10,
  filters: StaffMemberFilters = {},
): Promise<PaginatedStaffMembers> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const params: Record<string, unknown> = { limit, offset }
  if (filters.search) params.search = filters.search
  if (filters.staffRoleId) params.staffRoleId = filters.staffRoleId
  const response = await client.get<PaginatedStaffMembers>(apiURLs.staff.members.base, { params })
  return response.data
}

/** Permisos del usuario autenticado — usado por middleware/layout para filtrar navegación (solo UX). */
export async function fetchMyStaffPermissions(): Promise<MyStaffPermissions> {
  const client = await getServerApiClient()
  const response = await client.get<MyStaffPermissions>(apiURLs.staff.members.me)
  return response.data
}
