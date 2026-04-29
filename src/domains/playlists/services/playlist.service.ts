import { apiClient } from '@/src/shared/libs/axios/axios-client';
import { apiURLs } from '@/src/shared/constants/urls';
import { CreatePlaylistInput, PaginatedPlaylistsResponse, Playlist } from '../types/playlist.types';

class PlaylistService {
  async getPlaylists(params: Record<string, any> = {}): Promise<PaginatedPlaylistsResponse> {
    const { data } = await apiClient.get<PaginatedPlaylistsResponse>(apiURLs.playlists.base, { params });
    return data;
  }

  async getPlaylistById(id: string): Promise<Playlist> {
    const { data } = await apiClient.get<Playlist>(apiURLs.playlists.byId(id));
    return data;
  }

  async createPlaylist(input: CreatePlaylistInput): Promise<Playlist> {
    const { data } = await apiClient.post<Playlist>(apiURLs.playlists.base, input);
    return data;
  }

  async deletePlaylist(id: string): Promise<void> {
    await apiClient.delete(apiURLs.playlists.byId(id));
  }
  async updatePlaylist(id: string, input: any): Promise<Playlist> {
    const { data } = await apiClient.put<Playlist>(apiURLs.playlists.byId(id), input);
    return data;
  }
}

export const playlistService = new PlaylistService();
