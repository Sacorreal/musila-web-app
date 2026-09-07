'use client';

import { apiClient } from '@/src/shared/libs/axios/axios-client';
import { apiURLs } from '@/src/shared/constants/urls';
import { PublisherCommissionPolicyDto, RosterCommissionItem } from './publisher-commission.types';

export async function setPublisherCommissionEnabledAction(
  organizationId: string,
  commissionEnabled: boolean,
): Promise<PublisherCommissionPolicyDto> {
  const response = await apiClient.put<PublisherCommissionPolicyDto>(
    apiURLs.publisherCommission.policy(organizationId),
    { commissionEnabled },
  );
  return response.data;
}

export async function updateRosterCommissionsAction(
  organizationId: string,
  items: RosterCommissionItem[],
): Promise<PublisherCommissionPolicyDto> {
  const response = await apiClient.put<PublisherCommissionPolicyDto>(
    apiURLs.publisherCommission.roster(organizationId),
    { items },
  );
  return response.data;
}
