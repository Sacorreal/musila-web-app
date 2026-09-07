'use server';

import { apiURLs } from '@/src/shared/constants/urls';
import { getAffiliateServerApiClient } from './affiliate-api-client';
import type { AffiliateProfile, UpdateAffiliateProfileInput } from '../types/affiliate.types';
import type {
  AffiliateCommissionsResponse,
  AffiliateDashboard,
  AffiliateReferralsResponse,
  CommissionStatus,
} from '../types/affiliate-dashboard.types';

export async function getMyAffiliateProfileAction(): Promise<AffiliateProfile> {
  const client = await getAffiliateServerApiClient();
  const { data } = await client.get<AffiliateProfile>(apiURLs.affiliates.me);
  return data;
}

export async function updateMyAffiliateProfileAction(
  dto: UpdateAffiliateProfileInput,
): Promise<AffiliateProfile> {
  const client = await getAffiliateServerApiClient();
  const { data } = await client.patch<AffiliateProfile>(apiURLs.affiliates.me, dto);
  return data;
}

export async function getMyAffiliateDashboardAction(): Promise<AffiliateDashboard> {
  const client = await getAffiliateServerApiClient();
  const { data } = await client.get<AffiliateDashboard>(apiURLs.affiliates.dashboard);
  return data;
}

export async function getMyAffiliateReferralsAction(
  limit = 10,
  offset = 0,
): Promise<AffiliateReferralsResponse> {
  const client = await getAffiliateServerApiClient();
  const { data } = await client.get<AffiliateReferralsResponse>(apiURLs.affiliates.referrals, {
    params: { limit, offset },
  });
  return data;
}

export async function getMyAffiliateCommissionsAction(
  limit = 10,
  offset = 0,
  status?: CommissionStatus,
): Promise<AffiliateCommissionsResponse> {
  const client = await getAffiliateServerApiClient();
  const { data } = await client.get<AffiliateCommissionsResponse>(apiURLs.affiliates.commissions, {
    params: { limit, offset, status },
  });
  return data;
}
