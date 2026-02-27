'use server'

import { apiURLs } from "@/src/shared/constants/urls";
import { Language } from "../types/track.type";

export async function fetchLanguages(): Promise<Language[]> {
    const response = await fetch(apiURLs.languages.all)
  
    if (!response.ok) {
      throw new Error("Error al cargar idiomas")
    }
  
    const languages: Language[] = await response.json()
  
    return languages.sort((a, b) => {
      const isASpanish = a.label.toLowerCase() === "español"
      const isBSpanish = b.label.toLowerCase() === "español"
  
      if (isASpanish && !isBSpanish) return -1
      if (!isASpanish && isBSpanish) return 1
      return a.label.localeCompare(b.label)
    })
  }