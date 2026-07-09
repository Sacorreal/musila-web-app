import { UserRole } from '@/src/domains/users/types/user.types'
import { PaginatedResponse } from '@shared/types/shared.types'

export interface AdminStatsDto {
  totalUsers: number
  totalTracks: number
  totalGenres: number
  totalRequests: number
  pendingRequests: number
  approvedRequests: number
  rejectedRequests: number
}

export interface AdminUserDto {
  id: string
  name: string
  secondName?: string
  lastName: string
  secondLastName?: string
  email: string
  role: UserRole
  avatarUrl?: string
  isVerified: boolean
  plan: 'free' | 'pro'
  planExpiresAt?: string | null
  citizenID?: string
  typeCitizenID?: string
  countryCode?: string
  phone?: string
  biography?: string
  fiscalName?: string
  taxId?: string
  fiscalAddress?: string
  createdAt: string
  deletedAt: string | null
}

export interface AdminTrackDto {
  id: string
  title: string
  genre: string
  subGenre?: string
  coverUrl?: string
  audioUrl?: string | null
  language: string
  isAvailable: boolean
  isGospel: boolean
  authors: { id: string; name: string; lastName: string }[]
  createdAt: string
}

export interface AdminGenreDto {
  id: string
  genre: string
  subGenre: string[]
  slug?: string
  createdAt: string
}

export interface AdminRequestDto {
  id: string
  status: string
  licenseType: string
  approvedByRequester: boolean
  approvedByOwner: boolean
  documentUrl?: string
  licensePrice?: number | null
  licensePaymentStatus: string
  licensePaymentReference?: string | null
  createdAt: string
  requester?: { id: string; name: string; lastName: string; email: string }
  owner?: { id: string; name: string; lastName: string; email: string }
  track?: { id: string; title: string }
}

export interface CreateAdminUserInput {
  name: string
  lastName: string
  email: string
  password: string
  citizenID?: string
  typeCitizenID?: string
}

export interface CreateGenreInput {
  genre: string
  subGenre?: string[]
  slug?: string
}

export interface UpdateGenreInput extends Partial<CreateGenreInput> {}

export type PaginatedAdminUsers = PaginatedResponse<AdminUserDto>
export type PaginatedAdminTracks = PaginatedResponse<AdminTrackDto>
export type PaginatedAdminGenres = PaginatedResponse<AdminGenreDto>
export type PaginatedAdminRequests = PaginatedResponse<AdminRequestDto>

export interface UserFilters {
  search?: string
  role?: string
  isVerified?: boolean
}

export interface TrackFilters {
  title?: string
  language?: string
  isAvailable?: boolean
  isGospel?: boolean
  genreId?: string
  subGenre?: string
}
