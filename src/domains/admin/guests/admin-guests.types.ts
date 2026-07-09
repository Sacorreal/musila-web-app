import { PaginatedResponse } from '@shared/types/shared.types'

export interface AdminGuestDto {
  id: string
  name: string
  lastName: string
  email: string
  countryCode?: string
  phone?: string
  typeCitizenID?: string
  citizenID?: string
  isVerified: boolean
  role: string
  invited_by?: { id: string; name: string; lastName: string; email: string }
  createdAt: string
}

export interface CreateGuestAdminInput {
  name: string
  lastName: string
  email: string
  password: string
  invitedById: string
  countryCode?: string
  phone?: string
  typeCitizenID?: string
  citizenID?: string
}

export interface UpdateGuestAdminInput {
  name?: string
  lastName?: string
  email?: string
  countryCode?: string
  phone?: string
  typeCitizenID?: string
  citizenID?: string
}

export interface AdminGuestFilters {
  search?: string
}

export type PaginatedAdminGuests = PaginatedResponse<AdminGuestDto>
