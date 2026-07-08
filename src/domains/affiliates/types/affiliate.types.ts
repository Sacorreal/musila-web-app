export interface AffiliateBankAccount {
  bankName: string;
  accountType: string;
  accountNumber: string;
  accountHolderName: string;
  accountHolderIdType: string;
  accountHolderIdNumber: string;
}

export type AffiliateTier = 'standard' | 'ambassador' | 'partner';
export type AffiliateStatus = 'approved' | 'suspended' | 'rejected';

export interface RegisterAffiliateInput {
  name: string;
  lastName: string;
  email: string;
  password: string;
  repeatPassword: string;
  phone?: string;
  countryCode?: string;
  companyOrBrand?: string;
  website?: string;
  audienceDescription?: string;
  socialNetworks?: Record<string, string>;
  paymentPhone?: string;
  bankAccount?: AffiliateBankAccount;
  acceptedTerms: boolean;
}

export interface LoginAffiliateInput {
  email: string;
  password: string;
}

export interface AffiliateAuthResponse {
  token: string;
}

export interface AffiliateProfile {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  companyOrBrand?: string;
  website?: string;
  audienceDescription?: string;
  socialNetworks?: Record<string, string>;
  paymentPhone?: string;
  bankAccount?: AffiliateBankAccount;
  tier: AffiliateTier;
  status: AffiliateStatus;
  referralCode: string;
  referralLink: string;
  createdAt: string;
}

export interface UpdateAffiliateProfileInput {
  name?: string;
  lastName?: string;
  phone?: string;
  companyOrBrand?: string;
  website?: string;
  audienceDescription?: string;
  socialNetworks?: Record<string, string>;
  paymentPhone?: string;
  bankAccount?: AffiliateBankAccount;
}

export interface AffiliateTokenPayload {
  id: string;
  email: string;
  name: string;
  tier: AffiliateTier;
  status: AffiliateStatus;
  type: 'affiliate';
  iat: number;
  exp: number;
}

export type AffiliateAuthState = {
  affiliate: AffiliateTokenPayload | null;
  token: string | null;
  isAuthenticated: boolean;
  setSession: (data: { affiliate: AffiliateTokenPayload; token: string }) => void;
  clearSession: () => void;
};

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}
