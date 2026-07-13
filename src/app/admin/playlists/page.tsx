'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { adminPlaylistsHooks } from '@/src/domains/admin/playlists/admin-playlists.hooks'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { Button } from '@/src/shared/components/UI/button'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { PlaylistFormDialog } from './PlaylistFormDialog'
import { getPlaylistColumns } from './playlist-columns'
import type { AdminPlaylistDto } from '@/src/domains/admin/playlists/admin-playlists.types'

export default function AdminPlaylistsPage() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, error } = adminPlaylistsHooks.useAdminPlaylists(page, limit)
  const { mutate: deletePlaylist, isPending: isDeleting } = adminPlaylistsHooks.useDeletePlaylist()

  const [deleteTarget, setDeleteTarget] = useState<AdminPlaylistDto | null>(null)
  const [editTarget, setEditTarget] = useState<AdminPlaylistDto | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const columns = getPlaylistColumns({ onEdit: setEditTarget, onDelete: setDeleteTarget })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Playlists"
        description={`${data?.total ?? '—'} playlists en el sistema`}
        actions={
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Playlist
          </Button>
        }
      />

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar las playlists' : null}
        emptyMessage="No hay playlists registradas"
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />

      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deletePlaylist(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={isDeleting}
        title="¿Eliminar playlist?"
        description={`Se eliminará "${deleteTarget?.title}" y sus colaboraciones asociadas.`}
      />

      <PlaylistFormDialog isOpen={showCreate} onClose={() => setShowCreate(false)} />
      <PlaylistFormDialog isOpen={!!editTarget} onClose={() => setEditTarget(null)} initialData={editTarget} />
    </div>
  )
}
