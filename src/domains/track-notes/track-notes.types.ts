export type TrackNoteAuthorType = 'USER' | 'GUEST';

/**
 * Forma cruda tal como la devuelve el backend. Incluye `authorId` (no listado
 * explícitamente en el contrato original, pero indispensable) para poder
 * derivar `isMine` en el cliente comparando contra la identidad autenticada
 * actual (ver `track-notes.hooks.ts`).
 */
export interface TrackNoteDto {
  id: string;
  trackId: string;
  playlistId: string | null;
  authorId: string;
  authorName: string;
  authorType: TrackNoteAuthorType;
  content: string;
  timestampSeconds: number | null;
  createdAt: string;
  updatedAt: string;
}

/** Nota lista para la UI: incluye el campo derivado `isMine`. */
export interface TrackNote extends TrackNoteDto {
  isMine: boolean;
}

export interface CreateTrackNoteInput {
  trackId: string;
  /** Si se omite, la nota es privada; si se envía, se comparte con la playlist. */
  playlistId?: string;
  content: string;
  timestampSeconds?: number;
}

export interface UpdateTrackNoteInput {
  content?: string;
  timestampSeconds?: number;
}
