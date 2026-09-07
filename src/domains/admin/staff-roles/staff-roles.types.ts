import { PaginatedResponse } from '@shared/types/shared.types'

export interface StaffPermissionDto {
  id: string
  code: string
  module: string
  description: string
  createdAt: string
}

export type StaffPermissionsByModule = Record<string, StaffPermissionDto[]>

export interface StaffRoleDto {
  id: string
  name: string
  slug: string
  description?: string
  isSystem: boolean
  createdBy?: string
  permissions: StaffPermissionDto[]
  createdAt: string
  updatedAt: string
}

export interface CreateStaffRoleInput {
  name: string
  description?: string
  permissionIds: string[]
}

export type UpdateStaffRoleInput = Partial<CreateStaffRoleInput>

export interface StaffRoleFilters {
  search?: string
}

export type PaginatedStaffRoles = PaginatedResponse<StaffRoleDto> & {
  limit: number
  offset: number
}
