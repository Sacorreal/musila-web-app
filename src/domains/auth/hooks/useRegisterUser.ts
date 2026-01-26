import { CreateUserDTO } from '@domains/users/types/user.type'
import { useAuthStore } from '../store/useAuthStore'

import { decodeToken } from '../utils/decodeToken'

import { registerUserRequest } from '../services/auth.service'

export function useRegisterUser() {

    const setSession = useAuthStore((s) => s.setSession)

    const registerUser = async (dto: CreateUserDTO) => {
        const token = await registerUserRequest(dto)

        const decoded = decodeToken(token)

        const now = Date.now() / 1000
        if (decoded.exp < now) {
            throw new Error('Token expirado')
        }

        setSession({
            user: {
                email: decoded.email,
                id: decoded.id,
                role: decoded.role,
                name: decoded.name
            }
        })

    }

    return { registerUser }
}