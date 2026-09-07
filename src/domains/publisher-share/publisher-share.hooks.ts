'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMyPublisherSharesAction, getPublisherSharePolicyAction } from './publisher-share.actions';
import { updatePublisherSharesAction } from './publisher-share.client';
import { PublisherShareItem } from './publisher-share.types';

const policyKey = (orgId: string) => ['publisher-share', 'policy', orgId] as const;
const mineKey = ['publisher-share', 'mine'] as const;

export function usePublisherSharePolicy(organizationId: string) {
  return useQuery({
    queryKey: policyKey(organizationId),
    queryFn: () => getPublisherSharePolicyAction(organizationId),
    enabled: Boolean(organizationId),
  });
}

export function useUpdatePublisherShares(organizationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items: PublisherShareItem[]) => updatePublisherSharesAction(organizationId, items),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: policyKey(organizationId) });
      toast.success("Publisher's Share guardado");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'No se pudo guardar la configuración');
    },
  });
}

/** Publisher's Share que aplica al usuario actual cuando publica canciones. */
export function useMyPublisherShares() {
  return useQuery({
    queryKey: mineKey,
    queryFn: getMyPublisherSharesAction,
  });
}
