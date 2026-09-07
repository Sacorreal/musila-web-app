'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type {
  AssignStaffRoleInput,
  InviteStaffMemberInput,
  StaffMemberAssignmentDto,
} from './staff-members.types'

export async function inviteStaffMember(input: InviteStaffMemberInput): Promise<StaffMemberAssignmentDto> {
  const response = await apiClient.post<StaffMemberAssignmentDto>(apiURLs.staff.members.invite, input)
  return response.data
}

export async function assignStaffRole(
  userId: string,
  input: AssignStaffRoleInput,
): Promise<StaffMemberAssignmentDto> {
  const response = await apiClient.post<StaffMemberAssignmentDto>(
    apiURLs.staff.members.assignRole(userId),
    input,
  )
  return response.data
}

export async function revokeStaffRole(userId: string): Promise<void> {
  await apiClient.delete(apiURLs.staff.members.revokeRole(userId))
}
