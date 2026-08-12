import type {
  CapabilityDto,
  CapabilitySubject,
} from '@/src/domains/admin/authorization/authorization.types'
import type {
  MembershipDto,
  MembershipRoleDto,
  MembershipStatus,
  MembershipType,
  RoleDto,
  TrackspaceDto,
} from '@/src/domains/admin/organizations/organizations.types'

export interface MyMembershipOrganization {
  id: string
  name: string
  slug: string
  type: string
  isActive: boolean
}

export interface MyMembership {
  id: string
  status: string
  organizationId: string
  organization: MyMembershipOrganization
}

export interface MyMembershipsResponse {
  organizationMemberships: MyMembership[]
  rosterMemberships: MyMembership[]
}

export interface CreateOrgRoleInput {
  name: string
  description?: string
  type: 'ORGANIZATION' | 'ROSTER'
  capabilityIds: string[]
}

export type WorkspaceInviteLinkStatus = 'ACTIVE' | 'REVOKED'

export interface WorkspaceInviteLinkDto {
  id: string
  organizationId: string
  token: string
  status: WorkspaceInviteLinkStatus
  createdBy?: string
  expiresAt?: string | null
  maxUses?: number | null
  useCount: number
  createdAt: string
  updatedAt: string
}

export interface CreateInviteLinkInput {
  expiresInDays?: number | null
  maxUses?: number | null
}

export type AccessRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface AccessRequestUser {
  id: string
  name: string
  lastName?: string
  email: string
  typeCitizenID?: string
  citizenID?: string
}

export interface AccessRequestDto {
  id: string
  organizationId: string
  inviteLinkId?: string | null
  userId: string
  status: AccessRequestStatus
  decidedBy?: string
  decidedAt?: string | null
  rejectionReason?: string
  resultingMembershipId?: string
  createdAt: string
  user?: AccessRequestUser
}

export interface ApproveAccessRequestInput {
  membershipType: MembershipType
  roleId: string
}

/** Respuesta pública de validación del enlace de invitación del workspace. */
export interface WorkspaceInviteValidation {
  organizationId: string
  organizationName: string
  token: string
}

export type { CapabilityDto, CapabilitySubject, MembershipDto, MembershipRoleDto, MembershipStatus, MembershipType, RoleDto, TrackspaceDto }
