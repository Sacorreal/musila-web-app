'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/UI/card'
import { Checkbox } from '@/src/shared/components/UI/checkbox'
import type { StaffPermissionsByModule } from '../staff-roles.types'

const MODULE_LABELS: Record<string, string> = {
  blog: 'Blog',
  content: 'Contenido musical',
  playlists: 'Playlists',
  users: 'Usuarios',
  support: 'Soporte',
  billing: 'Facturación',
  legal: 'Legal',
  notifications: 'Notificaciones',
  system: 'Sistema',
  audit: 'Auditoría',
}

interface PermissionMatrixProps {
  permissionsByModule: StaffPermissionsByModule | undefined
  isLoading?: boolean
  selectedIds: string[]
  onChange: (ids: string[]) => void
  disabled?: boolean
}

/** Selector de permisos agrupado por módulo, con vista previa del alcance (Flow 3). */
export function PermissionMatrix({
  permissionsByModule,
  isLoading,
  selectedIds,
  onChange,
  disabled,
}: PermissionMatrixProps) {
  const toggleOne = (id: string) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter((v) => v !== id) : [...selectedIds, id])
  }

  const toggleModule = (moduleIds: string[], allSelected: boolean) => {
    if (allSelected) {
      onChange(selectedIds.filter((id) => !moduleIds.includes(id)))
    } else {
      onChange(Array.from(new Set([...selectedIds, ...moduleIds])))
    }
  }

  if (isLoading || !permissionsByModule) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-xl border border-border bg-muted/30" />
        ))}
      </div>
    )
  }

  const modules = Object.entries(permissionsByModule)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {selectedIds.length} permiso{selectedIds.length === 1 ? '' : 's'} seleccionado
          {selectedIds.length === 1 ? '' : 's'}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {modules.map(([moduleKey, permissions]) => {
          const moduleIds = permissions.map((p) => p.id)
          const allSelected = moduleIds.every((id) => selectedIds.includes(id))
          const someSelected = !allSelected && moduleIds.some((id) => selectedIds.includes(id))

          return (
            <Card key={moduleKey} className="py-4">
              <CardHeader className="px-4">
                <CardTitle className="flex items-center justify-between text-sm">
                  <label className="flex cursor-pointer items-center gap-2">
                    <Checkbox
                      checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                      onCheckedChange={() => toggleModule(moduleIds, allSelected)}
                      disabled={disabled}
                    />
                    {MODULE_LABELS[moduleKey] ?? moduleKey}
                  </label>
                  <span className="text-xs font-normal text-muted-foreground">
                    {moduleIds.filter((id) => selectedIds.includes(id)).length}/{moduleIds.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-4">
                {permissions.map((permission) => (
                  <label
                    key={permission.id}
                    className="flex cursor-pointer items-start gap-2 text-sm"
                  >
                    <Checkbox
                      checked={selectedIds.includes(permission.id)}
                      onCheckedChange={() => toggleOne(permission.id)}
                      disabled={disabled}
                      className="mt-0.5"
                    />
                    <span>{permission.description}</span>
                  </label>
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
