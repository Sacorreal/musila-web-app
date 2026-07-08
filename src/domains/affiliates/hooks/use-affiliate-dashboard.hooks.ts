'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getMyAffiliateDashboardAction,
  getMyAffiliateReferralsAction,
  getMyAffiliateCommissionsAction,
  updateMyAffiliateProfileAction,
} from '../services/affiliate-dashboard.actions';
import type { UpdateAffiliateProfileInput } from '../types/affiliate.types';
import type { CommissionStatus } from '../types/affiliate-dashboard.types';

export const AFFILIATE_DASHBOARD_QUERY_KEY = ['affiliate', 'dashboard'];
export const AFFILIATE_REFERRALS_QUERY_KEY = ['affiliate', 'referrals'];
export const AFFILIATE_COMMISSIONS_QUERY_KEY = ['affiliate', 'commissions'];

export function useAffiliateDashboard() {
  return useQuery({
    queryKey: AFFILIATE_DASHBOARD_QUERY_KEY,
    queryFn: () => getMyAffiliateDashboardAction(),
  });
}

export function useAffiliateReferrals(limit = 10, offset = 0) {
  return useQuery({
    queryKey: [...AFFILIATE_REFERRALS_QUERY_KEY, limit, offset],
    queryFn: () => getMyAffiliateReferralsAction(limit, offset),
  });
}

export function useAffiliateCommissions(limit = 10, offset = 0, status?: CommissionStatus) {
  return useQuery({
    queryKey: [...AFFILIATE_COMMISSIONS_QUERY_KEY, limit, offset, status],
    queryFn: () => getMyAffiliateCommissionsAction(limit, offset, status),
  });
}

export function useUpdateAffiliateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateAffiliateProfileInput) => updateMyAffiliateProfileAction(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AFFILIATE_DASHBOARD_QUERY_KEY });
      toast.success('Perfil actualizado correctamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar el perfil');
    },
  });
}
