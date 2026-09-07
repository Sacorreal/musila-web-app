import { Trash2, Copy } from 'lucide-react'
import { toast } from 'sonner'
import type { ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import {
  AffiliateStatus,
  AffiliateTier,
  type AdminAffiliateDto,
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

interface AffiliateColumnsOptions {
  onDelete: (row: AdminAffiliateDto) => void
  onUpdateTier: (params: { id: string; tier: AffiliateTier }) => void
  onUpdateStatus: (params: { id: string; status: AffiliateStatus }) => void
}

export function getAffiliateColumns({
  onDelete,
  onUpdateTier,
  onUpdateStatus,
}: AffiliateColumnsOptions): ColumnDef<AdminAffiliateDto>[] {
  return [
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
          onChange={(e) => onUpdateTier({ id: row.id, tier: e.target.value as AffiliateTier })}
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
          onChange={(e) => onUpdateStatus({ id: row.id, status: e.target.value as AffiliateStatus })}
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
          onClick={() => onDelete(row)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label={`Eliminar ${row.name}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      ),
    },
  ]
}
