import type { AdminTrackDto } from '@/src/domains/admin/types/admin.types'
import type { TrackResponse } from '@/src/domains/tracks/types/track.types'

/**
 * Adapta un `AdminTrackDto` (listado admin) a la forma `TrackResponse`
 * requerida por el reproductor global (`usePlayerStore`).
 */
export function toTrackForPlayer(t: AdminTrackDto): TrackResponse {
  return {
    id: t.id,
    title: t.title,
    genre: t.genre,
    subGenre: t.subGenre ?? '',
    coverUrl: t.coverUrl ?? '',
    audioUrl: t.audioUrl ?? null,
    year: 0,
    audioKey: '',
    language: t.language,
    lyric: '',
    externalsIds: null,
    isAvailable: t.isAvailable,
    isGospel: t.isGospel,
    coverKey: null,
    intellectualProperties: [],
    playlists: [],
    requestedTrack: [],
    createdAt: t.createdAt,
    updatedAt: t.createdAt,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authors: t.authors.map((a) => ({ id: a.id, name: a.name, lastName: a.lastName, email: '', role: '' as any })),
  }
}
