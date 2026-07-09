'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Users } from 'lucide-react'
import { adminPlaylistsHooks } from '@/src/domains/admin/playlists/admin-playlists.hooks'
import { AdminDataTable, type ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { Button } from '@/src/shared/components/UI/button'
import { PlaylistFormDialog } from './PlaylistFormDialog'
import type { AdminPlaylistDto } from '@/src/domains/admin/playlists/admin-playlists.types'

export default function AdminPlaylistsPage() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, error } = adminPlaylistsHooks.useAdminPlaylists(page, limit)
  const { mutate: deletePlaylist, isPending: isDeleting } = adminPlaylistsHooks.useDeletePlaylist()

  const [deleteTarget, setDeleteTarget] = useState<AdminPlaylistDto | null>(null)
  const [editTarget, setEditTarget] = useState<AdminPlaylistDto | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const columns: ColumnDef<AdminPlaylistDto>[] = [
    {
      key: 'title',
      header: 'Playlist',
      width: '2fr',
      render: (row) => <p className="text-sm font-semibold truncate">{row.title}</p>,
    },
    {
      key: 'owner',
      header: 'Propietario',
      width: '2fr',
      render: (row) => (
        <span className="text-xs text-muted-foreground truncate">
          {row.owner ? `${row.owner.name} ${row.owner.lastName}` : '—'}
        </span>
      ),
    },
    {
      key: 'tracks',
      header: 'Tracks',
      width: '80px',
      render: (row) => <span className="text-xs text-muted-foreground">{row.tracks?.length ?? 0}</span>,
    },
    {
      key: 'collaborators',
      header: 'Colaboradores',
      width: '110px',
      render: (row) => (
        <Link
          href={`/admin/playlists/${row.id}`}
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <Users className="h-3 w-3" />
          {row.collaborators?.length ?? 0}
        </Link>
      ),
    },
    {
      key: 'createdAt',
      header: 'Creada',
      width: '110px',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      width: '80px',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setEditTarget(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label={`Editar ${row.title}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Eliminar ${row.title}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight">Playlists</h2>
          <p className="text-sm text-muted-foreground">{data?.total ?? '—'} playlists en el sistema</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Playlist
        </Button>
      </div>

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
