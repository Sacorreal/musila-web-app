import { api } from "@/src/lib/api"
import type { RequestedTrack } from "@/src/shared/types/shared.types"

export interface CreateRequestInput {
  trackId: string
  message?: string
}

export interface UpdateRequestInput {
  status?: "PENDING" | "APPROVED" | "REJECTED"
  response?: string
}

export const requestsService = {
  async getAll(): Promise<{ data: RequestedTrack[] | null; error: string | null }> {
    return api.get<RequestedTrack[]>("/requested-tracks")
  },

  async getById(id: string): Promise<{ data: RequestedTrack | null; error: string | null }> {
    return api.get<RequestedTrack>(`/requested-tracks/${id}`)
  },

  async create(data: CreateRequestInput): Promise<{ data: RequestedTrack | null; error: string | null }> {
    return api.post<RequestedTrack>("/requested-tracks", data)
  },

  async update(id: string, data: UpdateRequestInput): Promise<{ data: RequestedTrack | null; error: string | null }> {
    return api.put<RequestedTrack>(`/requested-tracks/${id}`, data)
  },

  async delete(id: string): Promise<{ data: unknown; error: string | null }> {
    return api.delete(`/requested-tracks/${id}`)
  },
}
