'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AuthenticationResponseJSON } from '@simplewebauthn/browser';

import {
  confirmTotp,
  disableTotp,
  getMfaStatus,
  getOrganizationPolicy,
  getPasskeyLoginOptions,
  getPasskeyRegistrationOptions,
  getStepUpChallenge,
  listPasskeys,
  regenerateRecoveryCodes,
  renamePasskey,
  revokePasskey,
  setupTotp,
  updateOrganizationPolicy,
  verifyPasskeyLogin,
  verifyPasskeyRegistration,
  verifyStepUp,
} from '../services/security.actions';
import {
  runAuthenticationCeremony,
  runRegistrationCeremony,
} from '../client/passkey.client';
import type { OrganizationSecurityPolicyInput } from '../schema/security.schema';
import type { StepUpMethod } from '../types/security.types';

const keys = {
  passkeys: ['security', 'passkeys'] as const,
  mfaStatus: (orgId?: string) => ['security', 'mfa-status', orgId ?? 'personal'] as const,
  orgPolicy: (orgId: string) => ['security', 'org-policy', orgId] as const,
};

// ── Passkeys ────────────────────────────────────────────────────────

export function usePasskeys() {
  return useQuery({ queryKey: keys.passkeys, queryFn: listPasskeys });
}

/** Orquesta la ceremonia completa de registro (options → navegador → verify). */
export function useRegisterPasskey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name?: string) => {
      const options = await getPasskeyRegistrationOptions();
      const attestation = await runRegistrationCeremony(options);
      return verifyPasskeyRegistration(attestation, name);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.passkeys });
      qc.invalidateQueries({ queryKey: ['security', 'mfa-status'] });
    },
  });
}

export function useRenamePasskey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => renamePasskey(id, name),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.passkeys }),
  });
}

export function useRevokePasskey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => revokePasskey(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.passkeys });
      qc.invalidateQueries({ queryKey: ['security', 'mfa-status'] });
    },
  });
}

/** Orquesta el login con Passkey (options → navegador → verify → cookie). */
export function usePasskeyLogin() {
  return useMutation({
    mutationFn: async () => {
      const options = await getPasskeyLoginOptions();
      const assertion = await runAuthenticationCeremony(options);
      return verifyPasskeyLogin(assertion);
    },
  });
}

// ── MFA / TOTP ──────────────────────────────────────────────────────

export function useMfaStatus(organizationId?: string) {
  return useQuery({
    queryKey: keys.mfaStatus(organizationId),
    queryFn: () => getMfaStatus(organizationId),
  });
}

export function useSetupTotp() {
  return useMutation({ mutationFn: setupTotp });
}

export function useConfirmTotp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => confirmTotp(token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['security', 'mfa-status'] }),
  });
}

export function useDisableTotp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: disableTotp,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['security', 'mfa-status'] }),
  });
}

// ── Recovery Codes ──────────────────────────────────────────────────

export function useRegenerateRecoveryCodes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: regenerateRecoveryCodes,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['security', 'mfa-status'] }),
  });
}

// ── Step-up ─────────────────────────────────────────────────────────

/**
 * Resuelve un step-up. Para Passkey ejecuta la ceremonia; para TOTP envía el
 * código. Devuelve la ventana de autorización temporal concedida.
 */
export function useStepUp() {
  return useMutation({
    mutationFn: async (input: { scope: string; method: StepUpMethod; token?: string }) => {
      if (input.method === 'PASSKEY') {
        const options = await getStepUpChallenge(input.scope);
        const assertion: AuthenticationResponseJSON =
          await runAuthenticationCeremony(options);
        return verifyStepUp({ scope: input.scope, method: 'PASSKEY', response: assertion });
      }
      return verifyStepUp({ scope: input.scope, method: 'TOTP', token: input.token });
    },
  });
}

// ── Política de organización ────────────────────────────────────────

export function useOrganizationPolicy(orgId: string) {
  return useQuery({
    queryKey: keys.orgPolicy(orgId),
    queryFn: () => getOrganizationPolicy(orgId),
    enabled: Boolean(orgId),
  });
}

export function useUpdateOrganizationPolicy(orgId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: OrganizationSecurityPolicyInput) =>
      updateOrganizationPolicy(orgId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.orgPolicy(orgId) }),
  });
}
