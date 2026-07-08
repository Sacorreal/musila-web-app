'use client';

import { useCallback } from 'react';
import { useAffiliateAuthStore } from '../store/use-affiliate-auth-store';
import { decodeAffiliateToken } from '../utils/decode-affiliate-token';
import { loginAffiliateRequest, registerAffiliateRequest, deleteAffiliateCookie } from '../services/affiliate-auth.actions';
import type { LoginAffiliateInput, RegisterAffiliateInput } from '../types/affiliate.types';

export function useAffiliateAuth() {
  const setSession = useAffiliateAuthStore((s) => s.setSession);
  const clearSession = useAffiliateAuthStore((s) => s.clearSession);

  const processToken = useCallback(
    (newToken: string) => {
      const decoded = decodeAffiliateToken(newToken);
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp < now) {
        throw new Error('Token expirado');
      }

      setSession({ affiliate: decoded, token: newToken });
    },
    [setSession],
  );

  const loginAffiliate = async (dto: LoginAffiliateInput) => {
    const token = await loginAffiliateRequest(dto);
    processToken(token);
  };

  const registerAffiliate = async (dto: RegisterAffiliateInput) => {
    const token = await registerAffiliateRequest(dto);
    processToken(token);
  };

  const logoutAffiliate = useCallback(async () => {
    clearSession();
    await deleteAffiliateCookie();
  }, [clearSession]);

  return { loginAffiliate, registerAffiliate, logoutAffiliate };
}
