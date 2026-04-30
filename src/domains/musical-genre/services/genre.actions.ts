"use server";

import type { MusicalGenreDto } from "../types/musical-genre.types";
import { apiURLs } from "@/src/shared/constants/urls";
import { getServerApiClient } from "@/src/shared/libs/axios/axios-server";

export async function fetchGenresRequest(): Promise<MusicalGenreDto[]> {
  try {
    const client = await getServerApiClient();
    const { data } = await client.get<{data: MusicalGenreDto[], total: number}>(apiURLs.genres.base);
    return data.data;
  } catch (error) {
    console.error("Error en fetchGenresRequest:", error);
    throw error;
  }
}

export async function fetchGenreBySlugRequest(slug: string): Promise<MusicalGenreDto> {
  try {
    const client = await getServerApiClient();
    const { data } = await client.get<MusicalGenreDto>(apiURLs.genres.byId(slug));
    
    if (data && Array.isArray(data.tracks)) {
      data.tracks.forEach((track) => {
        if (!track.coverUrl) {
          track.coverUrl = '/cover-default.png';
        }
      });
    }
    
    return data;
  } catch (error) {
    console.error(`Error en fetchGenreBySlugRequest para slug ${slug}:`, error);
    throw error;
  }
}
