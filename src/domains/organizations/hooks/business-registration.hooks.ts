'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/src/domains/auth/store/use-auth-store';
import { decodeToken } from '@/src/domains/auth/utils/decode-token';
import {
  activateOrganizationAdminAction,
  checkOrganizationVerificationAction,
  fetchBusinessPlansAction,
  fetchMyOrganizationAction,
  fetchMyTrackspacesAction,
  registerBusinessAction,
  updateMyTrackspaceAction,
} from '../services/business-registration.actions';
import type { CreateBusinessRegistrationInput } from '../types/business-registration.types';

const ORGANIZATION_ONBOARDING_QUERY_KEY = 'organization-onboarding';
const ORGANIZATION_TRACKSPACES_QUERY_KEY = 'organization-onboarding-trackspaces';

export function useBusinessPlans() {
  return useQuery({
    queryKey: ['business-plans'],
    queryFn: fetchBusinessPlansAction,
  });
}

export function useRegisterBusiness() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (dto: CreateBusinessRegistrationInput) => registerBusinessAction(dto),
    onSuccess: ({ token }) => {
      const decoded = decodeToken(token);
      setSession({
        token,
        user: {
          id: decoded.id,
          email: decoded.email,
          planType: decoded.planType,
          name: decoded.name,
        },
      });
      toast.success('Solicitud enviada. Musila revisará tu registro pronto.');
    },
    onError: (error: Error) => toast.error(error.message ?? 'No se pudo enviar la solicitud'),
  });
}

export function useMyOrganization(organizationId: string) {
  return useQuery({
    queryKey: [ORGANIZATION_ONBOARDING_QUERY_KEY, organizationId],
    queryFn: () => fetchMyOrganizationAction(organizationId),
    enabled: !!organizationId,
  });
}

export function useMyTrackspaces(organizationId: string) {
  return useQuery({
    queryKey: [ORGANIZATION_TRACKSPACES_QUERY_KEY, organizationId],
    queryFn: () => fetchMyTrackspacesAction(organizationId),
    enabled: !!organizationId,
  });
}

export function useUpdateMyTrackspace(organizationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ trackspaceId, input }: { trackspaceId: string; input: { name?: string; logoUrl?: string | null } }) =>
      updateMyTrackspaceAction(organizationId, trackspaceId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ORGANIZATION_TRACKSPACES_QUERY_KEY, organizationId] });
      toast.success('Workspace actualizado');
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'No se pudo actualizar el workspace'),
  });
}

export function useActivateOrganizationAdmin(organizationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => activateOrganizationAdminAction(organizationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ORGANIZATION_ONBOARDING_QUERY_KEY, organizationId] });
      toast.success('Perfil de administrador activado');
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'No se pudo activar el perfil'),
  });
}

export function useCheckOrganizationVerification(organizationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => checkOrganizationVerificationAction(organizationId),
    onSuccess: (organization: { status?: string }) => {
      qc.invalidateQueries({ queryKey: [ORGANIZATION_ONBOARDING_QUERY_KEY, organizationId] });
      if (organization?.status === 'VERIFICADA') {
        toast.success('¡Tu organización está verificada!');
      }
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'No se pudo verificar la organización'),
  });
}
