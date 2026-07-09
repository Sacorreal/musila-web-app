import { PaginatedResponse } from '@shared/types/shared.types'

export enum AffiliateTier {
  STANDARD = 'standard',
  AMBASSADOR = 'ambassador',
  PARTNER = 'partner',
}

export enum AffiliateStatus {
  APPROVED = 'approved',
  SUSPENDED = 'suspended',
  REJECTED = 'rejected',
}

export interface AdminAffiliateBankAccount {
  bankName: string
  accountType: string
  accountNumber: string
  accountHolderName: string
  accountHolderIdType: string
  accountHolderIdNumber: string
}

export interface AdminAffiliateDto {
  id: string
  name: string
  lastName: string
  email: string
  phone?: string
  countryCode?: string
  companyOrBrand?: string
  website?: string
  audienceDescription?: string
  socialNetworks?: Record<string, string>
  paymentPhone?: string
  bankAccount?: AdminAffiliateBankAccount
  referralCode: string
  tier: AffiliateTier
  status: AffiliateStatus
  acceptedTermsAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateAffiliateAdminInput {
  name: string
  lastName: string
  email: string
  password: string
  phone?: string
  countryCode?: string
  companyOrBrand?: string
  website?: string
  audienceDescription?: string
  paymentPhone?: string
  tier?: AffiliateTier
  status?: AffiliateStatus
}

export interface AdminAffiliateFilters {
  status?: AffiliateStatus
  tier?: AffiliateTier
  q?: string
}

export type PaginatedAdminAffiliates = PaginatedResponse<AdminAffiliateDto>
