'use server'

import type { MusicalGenre } from '../types/musical-genre.types';
import { apiURLs } from '@/src/shared/constants/urls';



export async function fetchGenresRequest(): Promise<MusicalGenre[]> {
  try {
    const response = await fetch(apiURLs.genres.all);    
    if (!response.ok) {    
      throw new Error(`Error al obtener géneros: ${response.statusText} (${response.status})`);
    }

    const data: MusicalGenre[] = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error en fetchGenresRequest:', error);
    throw error;
  }
}