import { notFound } from "next/navigation";
import { fetchPlaylistByIdAction } from "@/src/domains/playlists/services/playlist.actions";
import { PlaylistOwnerSharePanel } from "@/src/domains/sharing/components/PlaylistOwnerSharePanel";
import { PlaylistTrackList } from "@/src/domains/playlists/components/PlaylistTrackList";

export default async function PlaylistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const playlist = await fetchPlaylistByIdAction(id);

    if (!playlist) {
      notFound();
    }

    return (
      <main className="container mx-auto p-4 md:p-8 flex flex-col gap-8">
        <section className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
          <img
            src={playlist.cover || "/cover-default.png"}
            alt={`Portada de ${playlist.title}`}
            className="w-36 h-36 sm:w-48 sm:h-48 rounded-2xl object-cover shadow-2xl border border-white/10"
          />
          <div className="flex flex-col gap-3 min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Playlist</p>
            <h1 className="text-2xl sm:text-4xl font-black text-foreground leading-tight tracking-tight break-words">
              {playlist.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {playlist.owner.name} {playlist.owner.lastName} · {playlist.tracks?.length ?? 0} pistas
            </p>

            <PlaylistOwnerSharePanel
              ownerId={playlist.owner.id}
              playlistId={playlist.id}
              playlistTitle={playlist.title}
            />
          </div>
        </section>

        <PlaylistTrackList tracks={playlist.tracks ?? []} />
      </main>
    );
  } catch (error) {
    console.error("Error fetching playlist details:", error);
    notFound();
  }
}
