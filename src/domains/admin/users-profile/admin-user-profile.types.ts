export interface UpdateUserProfileInput {
  name?: string
  secondName?: string
  lastName?: string
  secondLastName?: string
  email?: string
  countryCode?: string
  phone?: string
  typeCitizenID?: string
  citizenID?: string
  biography?: string
  isVerified?: boolean
  plan?: 'free' | 'pro'
  planExpiresAt?: string
  fiscalName?: string
  taxId?: string
  fiscalAddress?: string
}
