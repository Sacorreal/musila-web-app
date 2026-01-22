

import { authService } from '../services/auth.service'
import { useAuthStore } from '../store/useAuthStore'
import type { LoginDTO } from '../types/auth.types'
import { decodeToken } from '../utils/decodeToken'

export function useLogin() {

    const setSession = useAuthStore((s) => s.setSession)

    const login = async (dto: LoginDTO) => {
        const token = await authService.login(dto)

        const decoded = decodeToken(token)

        const now = Date.now() / 1000
        if (decoded.exp < now) {
            throw new Error('Token expirado')
        }

        setSession({
            token,
            user: {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
            },
        })
    }

    return { login }
}