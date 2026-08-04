import type { ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import type { StaffAuditLogDto } from '@/src/domains/admin/staff-audit/staff-audit.types'

export function getAuditLogColumns(): ColumnDef<StaffAuditLogDto>[] {
  return [
    {
      key: 'action',
      header: 'Módulo · Acción',
      width: '2fr',
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{row.module}:{row.action}</span>
          {row.entityType && (
            <span className="text-xs text-muted-foreground">
              {row.entityType}{row.entityId ? ` · ${row.entityId}` : ''}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'actor',
      header: 'Actor',
      width: '1.5fr',
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm">{row.actorName}</span>
          {row.actorRoleName && (
            <span className="text-xs text-muted-foreground">{row.actorRoleName}</span>
          )}
        </div>
      ),
    },
    {
      key: 'outcome',
      header: 'Resultado',
      width: '100px',
      render: (row) => (
        <span
          className={
            row.outcome === 'success'
              ? 'rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive'
          }
        >
          {row.outcome === 'success' ? 'Éxito' : 'Falla'}
        </span>
      ),
    },
    {
      key: 'ipAddress',
      header: 'IP',
      width: '120px',
      render: (row) => <span className="text-xs text-muted-foreground">{row.ipAddress ?? '—'}</span>,
    },
    {
      key: 'createdAt',
      header: 'Fecha',
      width: '150px',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.createdAt).toLocaleString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
  ]
}
