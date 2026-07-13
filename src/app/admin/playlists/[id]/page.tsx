'use client'

import { useParams } from 'next/navigation'
import { adminPlaylistsHooks } from '@/src/domains/admin/playlists/admin-playlists.hooks'
import { PlaylistDetailHeader } from '@/src/domains/admin/playlists/components/PlaylistDetailHeader'
import { PlaylistCollaboratorsPanel } from '@/src/domains/admin/playlist-collaborators/components/PlaylistCollaboratorsPanel'
import { LoadingState } from '@/src/shared/components/UI/LoadingState'

export default function AdminPlaylistDetailPage() {
  const params = useParams<{ id: string }>()
  const playlistId = params.id

  const { data: playlist, isLoading: isLoadingPlaylist } = adminPlaylistsHooks.useAdminPlaylist(playlistId)

  if (isLoadingPlaylist) {
    return <LoadingState />
  }

  const ownerName = playlist?.owner ? `${playlist.owner.name} ${playlist.owner.lastName}` : undefined

  return (
    <div className="space-y-6">
      <PlaylistDetailHeader title={playlist?.title} ownerName={ownerName} />
      <PlaylistCollaboratorsPanel playlistId={playlistId} />
    </div>
  )
}
