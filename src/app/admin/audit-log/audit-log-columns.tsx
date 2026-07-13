import type { ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import type { AdminAuditLogDto } from '@/src/domains/admin/readonly/audit-log/admin-audit-log.types'

export function getAuditLogColumns(): ColumnDef<AdminAuditLogDto>[] {
  return [
    {
      key: 'action',
      header: 'Acción',
      width: '2fr',
      render: (row) => <span className="text-sm font-semibold">{row.action}</span>,
    },
    {
      key: 'userId',
      header: 'Usuario',
      width: '2fr',
      render: (row) => <span className="text-xs font-mono text-muted-foreground">{row.userId}</span>,
    },
    {
      key: 'ipAddress',
      header: 'IP',
      width: '130px',
      render: (row) => <span className="text-xs text-muted-foreground">{row.ipAddress ?? '—'}</span>,
    },
    {
      key: 'createdAt',
      header: 'Fecha',
      width: '150px',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.createdAt).toLocaleString('es-ES', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
  ]
}
