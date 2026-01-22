'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'


import type { AuthState } from '../types/auth.types'


export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setSession: ({ user }) =>
        set({
          user,
          isAuthenticated: true,
        }),

      clearSession: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user
      }),
    }
  )
)
