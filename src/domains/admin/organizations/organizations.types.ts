import type { CapabilityDto, CapabilityScope, OrganizationType } from '../authorization/authorization.types'

export interface OrganizationDto {
  id: string
  tenantId: string
  name: string
  type: OrganizationType
  slug: string
  isActive: boolean
  createdAt: string
}

export interface CreateOrganizationInput {
  name: string
  slug: string
  type: OrganizationType
  planKey?: string
  /** Email del Organization Admin inicial (obligatorio). */
  adminEmail: string
  /** Nombre del Organization Admin, para personalizar el correo (opcional). */
  adminName?: string
}

export interface UpdateOrganizationInput {
  name?: string
  type?: OrganizationType
  isActive?: boolean
}

export type MembershipStatus = 'INVITED' | 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REMOVED'
export type MembershipType = 'ORGANIZATION' | 'ROSTER'

export interface MembershipDto {
  id: string
  organizationId: string
  userId: string
  status: MembershipStatus
  joinedAt?: string | null
  user?: { id: string; name: string; lastName?: string; email: string }
}

export interface RoleCapabilityDto {
  id: string
  capabilityId: string
  scope: CapabilityScope
  capability: CapabilityDto
}

export interface RoleDto {
  id: string
  tenantId: string
  type: 'PLATFORM' | 'ORGANIZATION' | 'ROSTER'
  source: 'SYSTEM' | 'CUSTOM'
  key?: string | null
  name: string
  description?: string | null
  isActive: boolean
  roleCapabilities?: RoleCapabilityDto[]
}

export interface MembershipRoleDto {
  id: string
  membershipType: MembershipType
  membershipId: string
  roleId: string
  role: RoleDto
}

export interface TrackspaceDto {
  id: string
  organizationId: string
  name: string
  logoUrl?: string | null
  isDefault: boolean
}
