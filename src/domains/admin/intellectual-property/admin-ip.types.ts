import { PaginatedResponse } from '@shared/types/shared.types'

export enum IntellectualPropertyType {
  COPYRIGHT_OFFICE = 'copyrightOffice',
  CMO = 'cmo',
  SPLIT_SHEET = 'splitSheet',
}

export interface AdminIntellectualPropertyDto {
  id: string
  type: IntellectualPropertyType
  key: string
  documentKey?: string
  documentUrl: string
  track?: { id: string; title: string }
  createdAt: string
  updatedAt: string
}

export interface CreateIntellectualPropertyAdminInput {
  type: IntellectualPropertyType
  key: string
  trackId: string
  documentKey?: string
  documentUrl: string
}

export type UpdateIntellectualPropertyAdminInput = Partial<CreateIntellectualPropertyAdminInput>

export type PaginatedAdminIntellectualProperty = PaginatedResponse<AdminIntellectualPropertyDto>
