import { PaginatedResponse } from '@shared/types/shared.types'
import type { StaffRoleDto } from '../staff-roles/staff-roles.types'

export interface StaffMemberUserDto {
  id: string
  name: string
  lastName: string
  email: string
  avatarUrl?: string
}

export interface StaffMemberAssignmentDto {
  id: string
  userId: string
  user: StaffMemberUserDto
  staffRoleId: string
  staffRole: StaffRoleDto
  assignedBy?: string
  assignedAt: string
  updatedAt: string
}

export interface InviteStaffMemberInput {
  name: string
  lastName: string
  email: string
  staffRoleId: string
}

export interface AssignStaffRoleInput {
  staffRoleId: string
}

export interface StaffMemberFilters {
  search?: string
  staffRoleId?: string
}

export type PaginatedStaffMembers = PaginatedResponse<StaffMemberAssignmentDto> & {
  limit: number
  offset: number
}

export interface MyStaffPermissions {
  staffRoleId: string | null
  roleName: string | null
  permissions: string[]
}
