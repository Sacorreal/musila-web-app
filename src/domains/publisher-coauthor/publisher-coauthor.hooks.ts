'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getMyPublisherCoauthorsAction,
  getPublisherCoauthorPolicyAction,
} from './publisher-coauthor.actions';
import { updateRosterCoauthorDefaultsAction } from './publisher-coauthor.client';
import { RosterCoauthorDefaultItem } from './publisher-coauthor.types';

const policyKey = (orgId: string) => ['publisher-coauthor', 'policy', orgId] as const;
const mineKey = ['publisher-coauthor', 'mine'] as const;

export function usePublisherCoauthorPolicy(organizationId: string) {
  return useQuery({
    queryKey: policyKey(organizationId),
    queryFn: () => getPublisherCoauthorPolicyAction(organizationId),
    enabled: Boolean(organizationId),
  });
}

export function useUpdateRosterCoauthorDefaults(organizationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items: RosterCoauthorDefaultItem[]) =>
      updateRosterCoauthorDefaultsAction(organizationId, items),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: policyKey(organizationId) });
      toast.success('Coautoría por defecto guardada');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'No se pudo guardar la configuración');
    },
  });
}

/** Coautorías por defecto que se inyectan cuando el usuario actual crea un split. */
export function useMyPublisherCoauthors() {
  return useQuery({
    queryKey: mineKey,
    queryFn: getMyPublisherCoauthorsAction,
  });
}
