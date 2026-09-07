"use server";

import { getServerApiClient } from "@/src/shared/libs/axios/axios-server";
import { apiURLs } from "@/src/shared/constants/urls";

/**
 * Registra una reproducción efectiva de un track. Es best-effort: si falla
 * (p. ej. sesión no autenticada), no interrumpe la reproducción del usuario.
 */
export async function registerTrackPlayAction(trackId: string): Promise<void> {
  try {
    const client = await getServerApiClient();
    await client.post(apiURLs.tracks.play(trackId));
  } catch {
    // Métrica no crítica: se ignora el error para no afectar la UX del reproductor.
  }
}
