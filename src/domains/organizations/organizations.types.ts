import type {
  CapabilityDto,
  CapabilitySubject,
} from '@/src/domains/admin/authorization/authorization.types'
import type {
  MembershipDto,
  MembershipRoleDto,
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

export type { CapabilityDto, CapabilitySubject, MembershipDto, MembershipRoleDto, MembershipType, RoleDto, TrackspaceDto }
