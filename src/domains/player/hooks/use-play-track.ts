"use client";

import { useCallback } from "react";
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import { usePlayerStore } from "../store/use-player-store";
import type { TrackResponse } from "@/src/domains/tracks/types/track.types";
import { LEGAL_IDENTITY_REQUIRED_EVENT } from "@/src/shared/libs/errors/legal-identity-error";

/**
 * Punto único de entrada para reproducir un track: si es de un tercero y el
 * usuario no tiene la identidad legal verificada (Ley 527), bloquea la
 * reproducción y abre el modal global en vez de reproducir. Sin round-trip de
 * red — usa la bandera informativa del store de auth (igual que el banner de
 * verificación de correo); el servidor sigue siendo la autoridad final vía
 * `TrackLegalIdentityGuard` en `POST /tracks/:id/play`.
 */
export function usePlayTrack() {
  const playTrack = useCallback((track: TrackResponse, playlistId?: string) => {
    const user = useAuthStore.getState().user;
    // `track.authors` a veces llega como string[] (solo ids) en vistas más
    // antiguas (ej. tablas de género) en vez de AuthorTrackDto[] — se maneja
    // ambas formas para no bloquear por error al dueño de su propio track.
    const isOwnTrack =
      track.authors?.some((author) => (typeof author === "string" ? author : author?.id) === user?.id) ?? false;

    if (!isOwnTrack && !user?.identidadLegalVerificada) {
      window.dispatchEvent(new CustomEvent(LEGAL_IDENTITY_REQUIRED_EVENT));
      return;
    }

    usePlayerStore.getState().play(track, playlistId);
  }, []);

  return { playTrack };
}
