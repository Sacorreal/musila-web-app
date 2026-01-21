'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { UserRole } from '@domains/users/types'
import { authService } from '../auth.service'
import type { LoginDTO } from '../types'
import { decodeToken } from '../utils/decodeToken'

type User = {
    id: string
    email: string
    role: UserRole
}

type AuthState = {
    user: User | null
    token: string | null
    isLoading: boolean

    login: (loginDTO: LoginDTO) => Promise<void>
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isLoading: false,

            /** LOGIN */
            login: async (loginDTO) => {
                set({ isLoading: true })

                const token = await authService.login(loginDTO)
                const decoded = decodeToken(token)

                const now = Date.now() / 1000
                if (decoded.exp < now) {
                    throw new Error('Token expirado')
                }

                const user: User = {
                    id: decoded.id,
                    email: decoded.email,
                    role: decoded.role,
                }

                set({
                    token,
                    user,
                    isLoading: false,
                })
            },

            /** LOGOUT */
            logout: () => {
                set({
                    token: null,
                    user: null,
                    isLoading: false,
                })
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),

            /** Solo persistimos data, no funciones */
            partialize: (state) => ({
                token: state.token,
                user: state.user,
            }),

            /** Validar token al rehidratar */
            onRehydrateStorage: () => (state) => {
                if (!state?.token) return

                try {
                    const decoded = decodeToken(state.token)
                    const now = Date.now() / 1000

                    if (decoded.exp < now) {
                        state.logout()
                    }
                } catch {
                    state.logout()
                }
            },
        }
    )
)
