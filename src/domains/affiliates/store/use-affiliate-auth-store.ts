'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { AffiliateAuthState } from '../types/affiliate.types'

export const useAffiliateAuthStore = create<AffiliateAuthState>()(
  persist(
    (set) => ({
      affiliate: null,
      token: null,
      isAuthenticated: false,

      setSession: ({ affiliate, token }) =>
        set({
          affiliate,
          token,
          isAuthenticated: true,
        }),

      clearSession: () =>
        set({
          affiliate: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'affiliate-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        affiliate: state.affiliate,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
