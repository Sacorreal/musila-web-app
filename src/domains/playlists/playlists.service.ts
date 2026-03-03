"use client";

import { apiClient } from "@/src/shared/libs/axios/axios-client";
import type { Playlist } from "@/src/domains/playlist/types/playlist.types";

type ServiceResult<T> = {
  data?: T;
  error?: string;
};

export const playlistsService = {
  async getAll(): Promise<ServiceResult<Playlist[]>> {
    try {
      const { data } = await apiClient.get<Playlist[]>("/playlists");
      return { data };
    } catch (error: any) {
      const message = error.response?.data?.message ?? "Error al obtener playlists";
      return { error: message };
    }
  },

  async getById(id: string): Promise<ServiceResult<Playlist>> {
    try {
      const { data } = await apiClient.get<Playlist>(`/playlists/${id}`);
      return { data };
    } catch (error: any) {
      const message = error.response?.data?.message ?? "Error al obtener la playlist";
      return { error: message };
    }
  },

  async create(input: { name: string; description?: string; isPublic: boolean }): Promise<ServiceResult<null>> {
    try {
      await apiClient.post("/playlists", input);
      return {};
    } catch (error: any) {
      const message = error.response?.data?.message ?? "Error al crear la playlist";
      return { error: message };
    }
  },

  async delete(id: string): Promise<ServiceResult<null>> {
    try {
      await apiClient.delete(`/playlists/${id}`);
      return {};
    } catch (error: any) {
      const message = error.response?.data?.message ?? "Error al eliminar la playlist";
      return { error: message };
    }
  },

  async addTrack(playlistId: string, trackId: string): Promise<ServiceResult<null>> {
    try {
      await apiClient.post(`/playlists/${playlistId}/tracks`, { trackId });
      return {};
    } catch (error: any) {
      const message = error.response?.data?.message ?? "Error al agregar la canción a la playlist";
      return { error: message };
    }
  },

  async removeTrack(playlistId: string, trackId: string): Promise<ServiceResult<null>> {
    try {
      await apiClient.delete(`/playlists/${playlistId}/tracks/${trackId}`);
      return {};
    } catch (error: any) {
      const message = error.response?.data?.message ?? "Error al eliminar la canción de la playlist";
      return { error: message };
    }
  },
};

