export interface OrgInviteValidationResponse {
  token: string
  email: string
  organizationId: string
  organizationName: string
  status: 'PENDING' | 'ACCEPTED' | 'REVOKED'
  expiresAt: string
}

export interface RegisterOrgAdminInput {
  token: string
  name: string
  lastName: string
  email: string
  password: string
  repeatPassword: string
  countryCode?: string
  phone?: string
  typeCitizenID?: string
  citizenID?: string
}

export interface RegisterOrgAdminResponse {
  token: string
  organizationId: string
}
