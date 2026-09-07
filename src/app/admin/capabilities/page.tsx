'use client'

import { useMemo, useState } from 'react'
import { Pencil } from 'lucide-react'
import { adminAuthorizationHooks } from '@/src/domains/admin/authorization/authorization.hooks'
import { AdminDataTable, type ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { Badge } from '@/src/shared/components/UI/badge'
import { Button } from '@/src/shared/components/UI/button'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/UI/select'
import type { CapabilityDto } from '@/src/domains/admin/authorization/authorization.types'
import { CapabilityConfigDialog } from './CapabilityConfigDialog'

const ALL = '__all__'

export default function AdminCapabilitiesPage() {
  const { data, isLoading, error } = adminAuthorizationHooks.useAdminCapabilities()
  const [domainFilter, setDomainFilter] = useState(ALL)
  const [editTarget, setEditTarget] = useState<CapabilityDto | null>(null)

  const domains = useMemo(
    () => [...new Set((data ?? []).map((capability) => capability.domain))].sort(),
    [data],
  )

  const filtered = useMemo(
    () =>
      (data ?? []).filter(
        (capability) => domainFilter === ALL || capability.domain === domainFilter,
      ),
    [data, domainFilter],
  )

  const columns: ColumnDef<CapabilityDto>[] = [
    {
      key: 'key',
      header: 'Capability',
      render: (capability) => (
        <div className="min-w-0">
          <p className="truncate font-mono text-sm">{capability.key}</p>
          <p className="truncate text-xs text-muted-foreground">{capability.name}</p>
        </div>
      ),
    },
    {
      key: 'domain',
      header: 'Dominio',
      width: '130px',
      render: (capability) => <Badge variant="outline">{capability.domain}</Badge>,
    },
    {
      key: 'action',
      header: 'Acción',
      width: '110px',
      render: (capability) => <Badge variant="secondary">{capability.action}</Badge>,
    },
    {
      key: 'assignableTo',
      header: 'Asignable a',
      render: (capability) => (
        <div className="flex flex-wrap gap-1">
          {capability.assignableTo.map((subject) => (
            <Badge key={subject} variant="secondary" className="text-[10px]">
              {subject.replace('_MEMBER', '')}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'organizationTypes',
      header: 'Tipos de org.',
      render: (capability) =>
        capability.organizationTypes.length === 0 ? (
          <span className="text-xs text-muted-foreground">Todos</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {capability.organizationTypes.map((type) => (
              <Badge key={type} variant="outline" className="text-[10px]">
                {type}
              </Badge>
            ))}
          </div>
        ),
    },
    {
      key: 'status',
      header: 'Estado',
      width: '110px',
      render: (capability) => (
        <Badge variant={capability.isActive ? 'default' : 'destructive'}>
          {capability.isActive ? 'Activa' : 'Inactiva'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '60px',
      render: (capability) => (
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Editar ${capability.key}`}
          onClick={() => setEditTarget(capability)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Matriz de capacidades"
        description={`${data?.length ?? '—'} capabilities en el catálogo global. Las keys se crean por seeds versionados; aquí se administra su configuración.`}
        actions={
          <Select value={domainFilter} onValueChange={setDomainFilter}>
            <SelectTrigger className="w-[190px]">
              <SelectValue placeholder="Filtrar por dominio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos los dominios</SelectItem>
              {domains.map((domain) => (
                <SelectItem key={domain} value={domain}>
                  {domain}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        error={error ? 'Error al cargar el catálogo de capabilities' : null}
        emptyMessage="No hay capabilities para este filtro"
        keyExtractor={(row) => row.id}
      />

      <CapabilityConfigDialog capability={editTarget} onClose={() => setEditTarget(null)} />
    </div>
  )
}
