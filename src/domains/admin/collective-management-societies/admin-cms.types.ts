import { PaginatedResponse } from '@shared/types/shared.types'

export enum CmoOrganizationType {
  CMO = 'CMO',
  PRO = 'PRO',
  COLLECTING_SOCIETY = 'COLLECTING_SOCIETY',
  OTHER = 'OTHER',
}

export enum CmoStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DEPRECATED = 'DEPRECATED',
}

export interface AdminCollectiveManagementSocietyDto {
  id: string
  officialName: string
  acronym: string
  country: string
  isoCountryCode: string
  cisacSocietyId: string | null
  organizationType: CmoOrganizationType
  status: CmoStatus
  createdAt: string
  updatedAt: string
}

export interface CreateCollectiveManagementSocietyAdminInput {
  officialName: string
  acronym: string
  country: string
  isoCountryCode: string
  cisacSocietyId?: string
  organizationType?: CmoOrganizationType
}

export type UpdateCollectiveManagementSocietyAdminInput = Partial<CreateCollectiveManagementSocietyAdminInput> & {
  status?: CmoStatus
}

export type PaginatedAdminCollectiveManagementSociety = PaginatedResponse<AdminCollectiveManagementSocietyDto>
