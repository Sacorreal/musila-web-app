import type { AffiliateProfile, PaginatedResponse } from './affiliate.types';

export type CommissionType = 'first_purchase' | 'recurring';
export type CommissionStatus = 'pending' | 'approved' | 'paid' | 'rejected';

export interface AffiliateReferralSummary {
  userId: string;
  firstName: string;
  emailMasked: string;
  registeredAt: string;
  converted: boolean;
}

export interface AffiliateCommissionSummary {
  id: string;
  type: CommissionType;
  status: CommissionStatus;
  saleAmount: number;
  commissionAmount: number;
  createdAt: string;
  approvalDueAt: string;
}

export interface AffiliateKpis {
  totalReferrals: number;
  referralsThisMonth: number;
  conversionRate: number;
  convertedReferrals: number;
  totalSalesAmount: number;
  commissionPending: number;
  commissionApproved: number;
  commissionPaid: number;
  commissionTotal: number;
}

export interface AffiliateDashboard {
  affiliate: AffiliateProfile;
  kpis: AffiliateKpis;
  recentReferrals: AffiliateReferralSummary[];
  recentCommissions: AffiliateCommissionSummary[];
}

export type AffiliateReferralsResponse = PaginatedResponse<AffiliateReferralSummary>;
export type AffiliateCommissionsResponse = PaginatedResponse<AffiliateCommissionSummary>;
