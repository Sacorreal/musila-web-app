import { api } from "@/src/lib/api"
import type { Language, MusicalGenre, Track } from "@/src/lib/types"

export interface CreateTrackInput {
  title: string
  description?: string
  audioUrl: string
  coverUrl?: string
  duration: number
  bpm?: number
  key?: string
  genreId?: string
  languageId?: string
  allowRequests?: boolean
}

export interface UpdateTrackInput extends Partial<CreateTrackInput> {}

export const tracksService = {
  async getAll(): Promise<{ data: Track[] | null; error: string | null }> {
    return api.get<Track[]>("/tracks")
  },

  async getById(id: string): Promise<{ data: Track | null; error: string | null }> {
    return api.get<Track>(`/tracks/${id}`)
  },

  async getMyTracks(): Promise<{ data: Track[] | null; error: string | null }> {
    return api.get<Track[]>("/tracks/my-tracks")
  },

  async getByPreferredGenres(): Promise<{ data: Track[] | null; error: string | null }> {
    return api.get<Track[]>("/tracks/by-preferred-genres")
  },

  async create(data: CreateTrackInput): Promise<{ data: Track | null; error: string | null }> {
    return api.post<Track>("/tracks", data)
  },

  async update(id: string, data: UpdateTrackInput): Promise<{ data: Track | null; error: string | null }> {
    return api.put<Track>(`/tracks/${id}`, data)
  },

  async delete(id: string): Promise<{ data: unknown; error: string | null }> {
    return api.delete(`/tracks/${id}`)
  },

  async getGenres(): Promise<{ data: MusicalGenre[] | null; error: string | null }> {
    return api.get<MusicalGenre[]>("/musical-genre")
  },

  async getLanguages(): Promise<{ data: Language[] | null; error: string | null }> {
    return api.get<Language[]>("/languages")
  },

  async search(query: string): Promise<{ data: Track[] | null; error: string | null }> {
    return api.get<Track[]>(`/search?q=${encodeURIComponent(query)}`)
  },
}
