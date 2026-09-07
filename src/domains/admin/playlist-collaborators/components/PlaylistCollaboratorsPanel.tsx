'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { adminPlaylistCollaboratorsHooks } from '@/src/domains/admin/playlist-collaborators/admin-playlist-collaborators.hooks'
import { AdminEntitySelect } from '@/src/domains/admin/shared/AdminEntitySelect'
import { fetchGuestOptions } from '@/src/domains/admin/shared/fetch-user-options'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { Button } from '@/src/shared/components/UI/button'
import { Field, FieldLabel } from '@/src/shared/components/UI/field'
import {
  CollaboratorPermission,
  type AdminPlaylistCollaboratorDto,
} from '@/src/domains/admin/playlist-collaborators/admin-playlist-collaborators.types'

const PERMISSION_LABELS: Record<string, string> = { read: 'Lectura', write: 'Escritura', admin: 'Admin' }

interface PlaylistCollaboratorsPanelProps {
  playlistId: string
}

export function PlaylistCollaboratorsPanel({ playlistId }: PlaylistCollaboratorsPanelProps) {
  const { data: collaborators, isLoading: isLoadingCollaborators } =
    adminPlaylistCollaboratorsHooks.usePlaylistCollaborators(playlistId)
  const { mutateAsync: addCollaborator, isPending: isAdding } =
    adminPlaylistCollaboratorsHooks.useAddCollaborator(playlistId)
  const { mutate: removeCollaborator, isPending: isRemoving } =
    adminPlaylistCollaboratorsHooks.useRemoveCollaborator(playlistId)

  const [removeTarget, setRemoveTarget] = useState<AdminPlaylistCollaboratorDto | null>(null)

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: { guestId: '', permission: CollaboratorPermission.READ as string },
  })

  const onSubmit = async (data: { guestId: string; permission: string }) => {
    if (!data.guestId) return
    await addCollaborator({ guestId: data.guestId, permission: data.permission as CollaboratorPermission })
    reset({ guestId: '', permission: CollaboratorPermission.READ })
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Colaboradores</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-3">
        <Controller
          name="guestId"
          control={control}
          render={({ field }) => (
            <Field className="min-w-[260px] flex-1">
              <FieldLabel>Invitado</FieldLabel>
              <AdminEntitySelect
                value={field.value || null}
                onChange={field.onChange}
                fetchOptions={fetchGuestOptions}
                placeholder="Buscar invitado..."
              />
            </Field>
          )}
        />
        <Controller
          name="permission"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Permiso</FieldLabel>
              <select
                value={field.value}
                onChange={field.onChange}
                className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                {Object.values(CollaboratorPermission).map((p) => (
                  <option key={p} value={p}>{PERMISSION_LABELS[p]}</option>
                ))}
              </select>
            </Field>
          )}
        />
        <Button type="submit" disabled={isAdding || !watch('guestId')} className="gap-2">
          {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Agregar
        </Button>
      </form>

      <div className="divide-y divide-border/50 rounded-xl border border-border">
        {isLoadingCollaborators ? (
          <p className="p-4 text-sm text-muted-foreground">Cargando colaboradores...</p>
        ) : !collaborators?.length ? (
          <p className="p-4 text-sm text-muted-foreground">Sin colaboradores todavía.</p>
        ) : (
          collaborators.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium">{c.guest.name} {c.guest.lastName}</p>
                <p className="text-xs text-muted-foreground">{c.guest.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">
                  {PERMISSION_LABELS[c.permission]}
                </span>
                <button
                  onClick={() => setRemoveTarget(c)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Quitar a ${c.guest.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AdminConfirmDialog
        isOpen={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={() => {
          if (removeTarget) removeCollaborator(removeTarget.guest.id, { onSuccess: () => setRemoveTarget(null) })
        }}
        isLoading={isRemoving}
        title="¿Quitar colaborador?"
        description={`"${removeTarget?.guest.name} ${removeTarget?.guest.lastName}" perderá acceso a esta playlist.`}
        confirmLabel="Quitar"
      />
    </div>
  )
}
