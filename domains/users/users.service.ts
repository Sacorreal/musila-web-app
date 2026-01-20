import { api } from "@/lib/api"
import type { User } from "@/lib/types"

export interface UpdateUserInput {
  name?: string
  lastName?: string
  artisticName?: string
  bio?: string
  avatar?: string
  preferredGenreIds?: string[]
}

export const usersService = {
  async getAll(): Promise<{ data: User[] | null; error: string | null }> {
    return api.get<User[]>("/users")
  },

  async getById(id: string): Promise<{ data: User | null; error: string | null }> {
    return api.get<User>(`/users/${id}`)
  },

  async getAuthors(): Promise<{ data: User[] | null; error: string | null }> {
    return api.get<User[]>("/users/authors")
  },

  async getAuthorById(id: string): Promise<{ data: User | null; error: string | null }> {
    return api.get<User>(`/users/author/${id}`)
  },

  async getFeaturedAuthors(userId: string): Promise<{ data: User[] | null; error: string | null }> {
    return api.get<User[]>(`/users/${userId}/featured-authors`)
  },

  async update(id: string, data: UpdateUserInput): Promise<{ data: User | null; error: string | null }> {
    return api.put<User>(`/users/${id}`, data)
  },

  async delete(id: string): Promise<{ data: unknown; error: string | null }> {
    return api.delete(`/users/${id}`)
  },

  async getRoles(): Promise<{ data: string[] | null; error: string | null }> {
    return api.get<string[]>("/users/roles")
  },
}
