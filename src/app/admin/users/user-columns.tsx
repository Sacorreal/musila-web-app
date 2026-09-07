import { Trash2, Pencil } from 'lucide-react'
import type { ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import type { AdminUserDto } from '@/src/domains/admin/types/admin.types'
import { UserPlanType, MusicRole, MUSIC_ROLE_LABELS } from '@/src/domains/users/types/user.types'

const PLAN_TYPE_COLORS: Record<string, string> = {
  admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  plan_autor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  plan_descubridor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  plan_360: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  invitado: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  plan_publisher: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
}

interface UserColumnsOptions {
  onEdit: (row: AdminUserDto) => void
  onDelete: (row: AdminUserDto) => void
  onUpdatePlanType: (params: { id: string; planType: UserPlanType }) => void
  onUpdateMusicRole: (params: { id: string; role: MusicRole }) => void
}

export function getUserColumns({ onEdit, onDelete, onUpdatePlanType, onUpdateMusicRole }: UserColumnsOptions): ColumnDef<AdminUserDto>[] {
  return [
    {
      key: 'name',
      header: 'Usuario',
      width: '2fr',
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{row.name} {row.lastName}</p>
          <p className="truncate text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'planType',
      header: 'Plan',
      width: '160px',
      render: (row) => (
        <select
          value={row.planType}
          onChange={(e) => onUpdatePlanType({ id: row.id, planType: e.target.value as UserPlanType })}
          className={`rounded-full px-2 py-0.5 text-xs font-semibold border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 ${PLAN_TYPE_COLORS[row.planType] ?? 'bg-muted text-foreground'}`}
          aria-label={`Plan de ${row.name}`}
        >
          {Object.values(UserPlanType).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      ),
    },
    {
      key: 'role',
      header: 'Rol',
      width: '160px',
      render: (row) => (
        <select
          value={row.role}
          onChange={(e) => onUpdateMusicRole({ id: row.id, role: e.target.value as MusicRole })}
          className="rounded-full px-2 py-0.5 text-xs font-semibold border-0 cursor-pointer bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          aria-label={`Rol musical de ${row.name}`}
        >
          {Object.values(MusicRole).map((r) => (
            <option key={r} value={r}>{MUSIC_ROLE_LABELS[r]}</option>
          ))}
        </select>
      ),
    },
    {
      key: 'verified',
      header: 'Verificado',
      width: '100px',
      render: (row) => (
        <span className={`text-xs font-medium ${row.isVerified ? 'text-emerald-600' : 'text-muted-foreground'}`}>
          {row.isVerified ? 'Sí' : 'No'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Registro',
      width: '120px',
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
            onClick={() => onEdit(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label={`Editar ${row.name}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Eliminar ${row.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ]
}
