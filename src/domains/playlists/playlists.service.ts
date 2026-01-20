import { api } from "@/src/lib/api"
import type { Playlist } from "@/src/lib/types"

export interface CreatePlaylistInput {
  name: string
  description?: string
  coverUrl?: string
  isPublic?: boolean
  trackIds?: string[]
}

export interface UpdatePlaylistInput extends Partial<CreatePlaylistInput> {}

export const playlistsService = {
  async getAll(): Promise<{ data: Playlist[] | null; error: string | null }> {
    return api.get<Playlist[]>("/playlists")
  },

  async getById(id: string): Promise<{ data: Playlist | null; error: string | null }> {
    return api.get<Playlist>(`/playlists/${id}`)
  },

  async create(data: CreatePlaylistInput): Promise<{ data: Playlist | null; error: string | null }> {
    return api.post<Playlist>("/playlists", data)
  },

  async update(id: string, data: UpdatePlaylistInput): Promise<{ data: Playlist | null; error: string | null }> {
    return api.put<Playlist>(`/playlists/${id}`, data)
  },

  async delete(id: string): Promise<{ data: unknown; error: string | null }> {
    return api.delete(`/playlists/${id}`)
  },

  async addTrack(playlistId: string, trackId: string): Promise<{ data: Playlist | null; error: string | null }> {
    return api.post<Playlist>(`/playlists/${playlistId}/tracks`, { trackId })
  },

  async removeTrack(playlistId: string, trackId: string): Promise<{ data: Playlist | null; error: string | null }> {
    return api.delete<Playlist>(`/playlists/${playlistId}/tracks/${trackId}`)
  },
}
