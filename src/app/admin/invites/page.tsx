'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Filter, X, Link2 } from 'lucide-react'
import { toast } from 'sonner'
import { adminInvitesHooks } from '@/src/domains/admin/invites/admin-invites.hooks'
import { AdminDataTable, type ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { Button } from '@/src/shared/components/UI/button'
import { InviteFormDialog } from './InviteFormDialog'
import type { AdminInviteDto, AdminInviteFilters } from '@/src/domains/admin/invites/admin-invites.types'

export default function AdminInvitesPage() {
  const [page, setPage] = useState(1)
  const limit = 10
  const [status, setStatus] = useState<'all' | 'used' | 'pending'>('all')

  const filters: AdminInviteFilters = {
    ...(status !== 'all' && { isUsed: status === 'used' }),
  }

  useEffect(() => { setPage(1) }, [status])

  const { data, isLoading, error } = adminInvitesHooks.useAdminInvites(page, limit, filters)
  const { mutate: revokeInvite, isPending: isRevoking } = adminInvitesHooks.useRevokeInvite()

  const [revokeTarget, setRevokeTarget] = useState<AdminInviteDto | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const isExpired = (invite: AdminInviteDto) => new Date(invite.expiresAt) < new Date()

  const columns: ColumnDef<AdminInviteDto>[] = [
    {
      key: 'email',
      header: 'Destinatario',
      width: '2fr',
      render: (row) => <span className="text-sm font-medium">{row.email ?? '—'}</span>,
    },
    {
      key: 'invitedBy',
      header: 'Invitado por',
      width: '2fr',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.invitedBy ? `${row.invitedBy.name} ${row.invitedBy.lastName}` : '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      width: '110px',
      render: (row) => {
        const label = row.isUsed ? 'Usada' : isExpired(row) ? 'Expirada' : 'Pendiente'
        const color = row.isUsed
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
          : isExpired(row)
            ? 'bg-muted text-muted-foreground'
            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
        return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${color}`}>{label}</span>
      },
    },
    {
      key: 'token',
      header: 'Token',
      width: '90px',
      render: (row) => (
        <button
          onClick={() => {
            navigator.clipboard.writeText(row.token)
            toast.success('Token copiado')
          }}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Link2 className="h-3 w-3" />
          Copiar
        </button>
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
      header: '',
      width: '48px',
      render: (row) => (
        <button
          onClick={() => setRevokeTarget(row)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label="Revocar invitación"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight">Invitaciones</h2>
          <p className="text-sm text-muted-foreground">{data?.total ?? '—'} invitaciones generadas</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Invitación
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Filter className="h-3.5 w-3.5" />
          Filtros
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'all' | 'used' | 'pending')}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="all">Todas</option>
            <option value="pending">Pendientes</option>
            <option value="used">Usadas</option>
          </select>
          {status !== 'all' && (
            <button
              onClick={() => setStatus('all')}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
            >
              <X className="h-3.5 w-3.5" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar las invitaciones' : null}
        emptyMessage="No hay invitaciones registradas"
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />

      <AdminConfirmDialog
        isOpen={!!revokeTarget}
        onClose={() => setRevokeTarget(null)}
        onConfirm={() => {
          if (revokeTarget) revokeInvite(revokeTarget.id, { onSuccess: () => setRevokeTarget(null) })
        }}
        isLoading={isRevoking}
        title="¿Revocar invitación?"
        description={`Se eliminará la invitación para "${revokeTarget?.email ?? revokeTarget?.token}". Si aún no fue usada, el enlace dejará de funcionar.`}
        confirmLabel="Revocar"
      />

      <InviteFormDialog isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  )
}
