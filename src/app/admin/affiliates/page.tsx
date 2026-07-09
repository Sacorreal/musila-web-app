'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Trash2, X, Filter, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { adminAffiliatesHooks } from '@/src/domains/admin/affiliates/admin-affiliates.hooks'
import { AdminDataTable, type ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { useDebouncedSearch } from '@/src/domains/admin/shared/useDebouncedSearch'
import { Button } from '@/src/shared/components/UI/button'
import { AffiliateFormDialog } from './AffiliateFormDialog'
import {
  AffiliateStatus,
  AffiliateTier,
  type AdminAffiliateDto,
  type AdminAffiliateFilters,
} from '@/src/domains/admin/affiliates/admin-affiliates.types'

const STATUS_COLORS: Record<string, string> = {
  approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  suspended: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const TIER_LABELS: Record<string, string> = {
  standard: 'Standard',
  ambassador: 'Ambassador',
  partner: 'Partner',
}

export default function AdminAffiliatesPage() {
  const [page, setPage] = useState(1)
  const limit = 10

  const [searchInput, setSearchInput] = useState('')
  const [status, setStatus] = useState('')
  const [tier, setTier] = useState('')
  const debouncedSearch = useDebouncedSearch(searchInput, 400)

  const filters: AdminAffiliateFilters = {
    ...(debouncedSearch && { q: debouncedSearch }),
    ...(status && { status: status as AffiliateStatus }),
    ...(tier && { tier: tier as AffiliateTier }),
  }
  const hasActiveFilters = !!debouncedSearch || !!status || !!tier

  useEffect(() => { setPage(1) }, [debouncedSearch, status, tier])

  const { data, isLoading, error } = adminAffiliatesHooks.useAdminAffiliates(page, limit, filters)
  const { mutate: updateStatus } = adminAffiliatesHooks.useUpdateAffiliateStatus()
  const { mutate: updateTier } = adminAffiliatesHooks.useUpdateAffiliateTier()
  const { mutate: deleteAffiliate, isPending: isDeleting } = adminAffiliatesHooks.useDeleteAffiliate()

  const [deleteTarget, setDeleteTarget] = useState<AdminAffiliateDto | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const columns: ColumnDef<AdminAffiliateDto>[] = [
    {
      key: 'name',
      header: 'Afiliado',
      width: '2fr',
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{row.name} {row.lastName}</p>
          <p className="truncate text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'referralCode',
      header: 'Código',
      width: '140px',
      render: (row) => (
        <button
          onClick={() => {
            navigator.clipboard.writeText(row.referralCode)
            toast.success('Código copiado')
          }}
          className="flex items-center gap-1.5 rounded-lg bg-muted px-2 py-1 text-xs font-mono text-foreground transition-colors hover:bg-muted/70"
        >
          {row.referralCode}
          <Copy className="h-3 w-3" />
        </button>
      ),
    },
    {
      key: 'tier',
      header: 'Nivel',
      width: '150px',
      render: (row) => (
        <select
          value={row.tier}
          onChange={(e) => updateTier({ id: row.id, tier: e.target.value as AffiliateTier })}
          className="rounded-full border-0 bg-muted px-2 py-0.5 text-xs font-semibold text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
          aria-label={`Nivel de ${row.name}`}
        >
          {Object.values(AffiliateTier).map((t) => (
            <option key={t} value={t}>{TIER_LABELS[t]}</option>
          ))}
        </select>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      width: '150px',
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => updateStatus({ id: row.id, status: e.target.value as AffiliateStatus })}
          className={`rounded-full px-2 py-0.5 text-xs font-semibold border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 ${STATUS_COLORS[row.status] ?? 'bg-muted text-foreground'}`}
          aria-label={`Estado de ${row.name}`}
        >
          {Object.values(AffiliateStatus).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      ),
    },
    {
      key: 'createdAt',
      header: 'Registro',
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
        <button
          onClick={() => setDeleteTarget(row)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label={`Eliminar ${row.name}`}
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
          <h2 className="text-xl font-black tracking-tight">Afiliados</h2>
          <p className="text-sm text-muted-foreground">{data?.total ?? '—'} afiliados en el programa de referidos</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Afiliado
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Filter className="h-3.5 w-3.5" />
          Filtros
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar por nombre o email…"
              className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">Todos los estados</option>
            {Object.values(AffiliateStatus).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">Todos los niveles</option>
            {Object.values(AffiliateTier).map((t) => (
              <option key={t} value={t}>{TIER_LABELS[t]}</option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={() => { setSearchInput(''); setStatus(''); setTier('') }}
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
        error={error ? 'Error al cargar los afiliados' : null}
        emptyMessage={hasActiveFilters ? 'No se encontraron afiliados con esos filtros' : 'No hay afiliados registrados'}
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />

      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteAffiliate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={isDeleting}
        title="¿Eliminar afiliado?"
        description={`Se eliminará a "${deleteTarget?.name} ${deleteTarget?.lastName}" del programa de afiliados. Sus comisiones históricas se conservan.`}
      />

      <AffiliateFormDialog isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  )
}
