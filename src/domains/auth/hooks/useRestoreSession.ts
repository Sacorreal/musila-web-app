'use client'

import { useEffect } from 'react'
import { useAuthStore } from '../store/use-auth-store'
import { decodeToken } from '../utils/decode-token'

export function useRestoreSession() {
    const { token, clearSession } = useAuthStore()

    useEffect(() => {
        if (!token) return

        try {
            const decoded = decodeToken(token)
            const now = Date.now() / 1000

            if (decoded.exp < now) {
                clearSession()
            }
        } catch {
            clearSession()
        }
    }, [token, clearSession])
}