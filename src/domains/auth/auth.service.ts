import { api } from "@/src/lib/api";
import type { AuthResponse, LoginInput, RegisterInput, User } from "@/src/lib/types";

export const authService = {
  async login(credentials: LoginInput): Promise<{ data: AuthResponse | null; error: string | null }> {
    const response = await api.post<AuthResponse>("/auth/login", credentials)
    if (response.data?.access_token) {
      localStorage.setItem("musila_token", response.data.access_token)
      localStorage.setItem("musila_user", JSON.stringify(response.data.user))
    }
    return response
  },

  async register(userData: RegisterInput): Promise<{ data: AuthResponse | null; error: string | null }> {
    const response = await api.post<AuthResponse>("/auth/register", userData)
    if (response.data?.access_token) {
      localStorage.setItem("musila_token", response.data.access_token)
      localStorage.setItem("musila_user", JSON.stringify(response.data.user))
    }
    return response
  },

  async forgotPassword(email: string): Promise<{ data: unknown; error: string | null }> {
    return api.post("/auth/forgot-password", { email })
  },

  async resetPassword(token: string, password: string): Promise<{ data: unknown; error: string | null }> {
    return api.post("/auth/reset-password", { token, password })
  },

  logout(): void {
    localStorage.removeItem("musila_token")
    localStorage.removeItem("musila_user")
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem("musila_user")
    return userStr ? JSON.parse(userStr) : null
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("musila_token")
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}
