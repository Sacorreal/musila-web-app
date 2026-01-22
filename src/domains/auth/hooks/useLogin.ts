import { useAuthStore } from '../store/useAuthStore'
import type { LoginDTO } from '../types/auth.types'
import { decodeToken } from '../utils/decodeToken'

import { loginRequest } from '../services/auth.service'

export function useLogin() {

    const setSession = useAuthStore((s) => s.setSession)

    const login = async (dto: LoginDTO) => {
        const token = await loginRequest(dto)

        const decoded = decodeToken(token)

        const now = Date.now() / 1000
        if (decoded.exp < now) {
            throw new Error('Token expirado')
        }

        setSession({
            user: {
                email: decoded.email,
                id: decoded.id,
                role: decoded.role
            }
        })

    }

    return { login }
}