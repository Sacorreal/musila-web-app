'use client'

import { useAuthStore } from '../store/useAuthStore'

export function useLogout() {
    const clearSession = useAuthStore((s) => s.clearSession)

    const logout = () => {
        clearSession()
    }

    return { logout }
}