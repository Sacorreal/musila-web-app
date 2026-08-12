'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getPublisherCommissionPolicyAction } from './publisher-commission.actions';
import {
  setPublisherCommissionEnabledAction,
  updateRosterCommissionsAction,
} from './publisher-commission.client';
import { RosterCommissionItem } from './publisher-commission.types';

const policyKey = (orgId: string) => ['publisher-commission', 'policy', orgId] as const;

export function usePublisherCommissionPolicy(organizationId: string) {
  return useQuery({
    queryKey: policyKey(organizationId),
    queryFn: () => getPublisherCommissionPolicyAction(organizationId),
    enabled: Boolean(organizationId),
  });
}

export function useSetPublisherCommissionEnabled(organizationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commissionEnabled: boolean) =>
      setPublisherCommissionEnabledAction(organizationId, commissionEnabled),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: policyKey(organizationId) });
      toast.success('Configuración de comisión actualizada');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'No se pudo actualizar la comisión');
    },
  });
}

export function useUpdateRosterCommissions(organizationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items: RosterCommissionItem[]) =>
      updateRosterCommissionsAction(organizationId, items),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: policyKey(organizationId) });
      toast.success('Porcentajes de comisión guardados');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'No se pudieron guardar los porcentajes');
    },
  });
}
