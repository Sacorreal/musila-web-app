export enum SocietyAffiliationRightsType {
  PR = 'PR',
  MR = 'MR',
  SR = 'SR',
}

export enum SocietyAffiliationTerritoryMode {
  SPECIFIC_COUNTRIES = 'SPECIFIC_COUNTRIES',
  WORLDWIDE = 'WORLDWIDE',
  WORLDWIDE_EXCEPT = 'WORLDWIDE_EXCEPT',
}

export enum SocietyAffiliationStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  ENDED = 'ENDED',
  REJECTED = 'REJECTED',
}

export enum SocietyAffiliationVerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  DECLARED = 'DECLARED',
  DOCUMENT_SUPPORTED = 'DOCUMENT_SUPPORTED',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export interface CollectiveManagementSocietyDto {
  id: string
  officialName: string
  acronym: string
  country: string
  isoCountryCode: string
  cisacSocietyId: string | null
  organizationType: 'CMO' | 'PRO' | 'COLLECTING_SOCIETY' | 'OTHER'
  status: 'ACTIVE' | 'INACTIVE' | 'DEPRECATED'
}

export interface SocietyAffiliationDto {
  id: string
  authorId: string
  collectiveManagementSocietyId: string
  collectiveManagementSociety: CollectiveManagementSocietyDto
  rightsType: SocietyAffiliationRightsType
  territoryMode: SocietyAffiliationTerritoryMode
  territoryCountries: string[]
  membershipNumber: string | null
  ipiNameNumber: string | null
  ipiBaseNumber: string | null
  validFrom: string | null
  validTo: string | null
  status: SocietyAffiliationStatus
  verificationStatus: SocietyAffiliationVerificationStatus
  source: string
  createdAt: string
  updatedAt: string
}

export interface CreateSocietyAffiliationInput {
  collectiveManagementSocietyId: string
  rightsType: SocietyAffiliationRightsType
  territoryMode: SocietyAffiliationTerritoryMode
  territoryCountries?: string[]
  membershipNumber?: string
  ipiNameNumber: string
  ipiBaseNumber?: string
  validFrom?: string
}

export type UpdateSocietyAffiliationInput = Partial<CreateSocietyAffiliationInput>

export interface EndSocietyAffiliationInput {
  validTo?: string
}
