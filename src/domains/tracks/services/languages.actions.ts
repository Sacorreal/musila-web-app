'use server'

import { apiURLs } from "@/src/shared/constants/urls";
import { LanguageDto } from "../types/track.types";
import { getServerApiClient } from "@/src/shared/libs/axios/axios-server";

export async function fetchLanguages(): Promise<LanguageDto[]> {
  try {
    const client = await getServerApiClient();
    const response = await client.get<LanguageDto[]>(apiURLs.languages.base);
  
    const languages = response.data;
  
    return languages.sort((a, b) => {
      const isASpanish = a.label.toLowerCase() === "español"
      const isBSpanish = b.label.toLowerCase() === "español"
  
      if (isASpanish && !isBSpanish) return -1
      if (!isASpanish && isBSpanish) return 1
      return a.label.localeCompare(b.label)
    })
  } catch (error) {
    throw new Error("Error al cargar idiomas")
  }
}