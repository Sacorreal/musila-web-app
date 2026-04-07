"use server";

import type { MusicalGenre } from "../types/musical-genre.types";
import { apiURLs } from "@/src/shared/constants/urls";
import { getServerApiClient } from "@/src/shared/libs/axios/axios-server";

export async function fetchGenresRequest(): Promise<MusicalGenre[]> {
  try {
    const client = await getServerApiClient();
    const { data } = await client.get<MusicalGenre[]>(apiURLs.genres.base);
    return data;
  } catch (error) {
    console.error("Error en fetchGenresRequest:", error);
    throw error;
  }
}
