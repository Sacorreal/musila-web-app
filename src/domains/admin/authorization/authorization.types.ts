export type CapabilityAction =
  | 'VIEW' | 'CREATE' | 'EDIT' | 'DELETE' | 'MANAGE' | 'PUBLISH' | 'REQUEST' | 'APPROVE' | 'EXPORT' | 'OTHER'

export type CapabilitySubject = 'PLATFORM_MEMBER' | 'ORGANIZATION_MEMBER' | 'ROSTER_MEMBER'

export type CapabilityScope =
  | 'PLATFORM' | 'ORGANIZATION' | 'ROSTER' | 'OWN' | 'ASSIGNED' | 'RESOURCE' | 'CUSTOM'

export type OrganizationType =
  | 'LABEL' | 'PUBLISHER' | 'MANAGEMENT' | 'AGENCY' | 'MUSIC_LIBRARY' | 'OTHER'

export type AuthorizationDenyCode =
  | 'CAPABILITY_DENIED'
  | 'SCOPE_DENIED'
  | 'ORGANIZATION_TYPE_DENIED'
  | 'ENTITLEMENT_EXCEEDED'
  | 'MEMBERSHIP_INACTIVE'
  | 'PLAN_FEATURE_NOT_INCLUDED'
  | 'CAPABILITY_NOT_AVAILABLE_FOR_ORGANIZATION_TYPE'

export interface CapabilityDto {
  id: string
  key: string
  name: string
  description: string
  domain: string
  resource: string
  action: CapabilityAction
  assignableTo: CapabilitySubject[]
  allowedScopes: CapabilityScope[]
  organizationTypes: OrganizationType[]
  isSystem: boolean
  isActive: boolean
  version: number
}

export interface MyCapabilities {
  capabilities: string[]
}

export interface CapabilityOrigin {
  type: 'ROLE' | 'PLAN'
  id: string
  name: string
}

export interface CapabilityGrantDto {
  key: string
  scope: CapabilityScope
  origins: CapabilityOrigin[]
}

export interface EffectiveEntitlementDto {
  key: string
  name: string
  limit: number | null
  unlimited: boolean
  period: string
  consumed: number
  remaining: number | null
  subscriptionId: string
  planKey: string
}

export interface ExplainResponse {
  membership?: { type: string; id: string; status: string; organizationId: string }
  grants: CapabilityGrantDto[]
  exclusions: { capability: string; code: AuthorizationDenyCode }[]
  denied?: { allowed: false; code?: AuthorizationDenyCode }
  memberships: {
    organizationMemberships: { id: string; status: string; organization: { id: string; name: string } }[]
    rosterMemberships: { id: string; status: string; organization: { id: string; name: string } }[]
  }
  entitlements: EffectiveEntitlementDto[]
}

export interface CheckResponse {
  capability: string
  allowed: boolean
  code?: AuthorizationDenyCode
  missingCapabilities?: string[]
}

export interface UpdateCapabilityConfigInput {
  name?: string
  description?: string
  organizationTypes?: OrganizationType[]
  isActive?: boolean
}
