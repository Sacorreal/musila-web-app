"use client"

import type { LoginInput, RegisterInput, User } from "@/src/lib/types"
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { authService } from "../auth.service"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginInput) => Promise<{ error: string | null }>
  register: (userData: RegisterInput) => Promise<{ error: string | null }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const login = useCallback(async (credentials: LoginInput) => {
    const { data, error } = await authService.login(credentials)
    if (data) {
      setUser(data.user)
    }
    return { error }
  }, [])

  const register = useCallback(async (userData: RegisterInput) => {
    const { data, error } = await authService.register(userData)
    if (data) {
      setUser(data.user)
    }
    return { error }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
