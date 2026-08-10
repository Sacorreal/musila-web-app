'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Building2, Plus } from 'lucide-react'
import { adminOrganizationsHooks } from '@/src/domains/admin/organizations/organizations.hooks'
import { AdminDataTable, type ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { Badge } from '@/src/shared/components/UI/badge'
import { Button } from '@/src/shared/components/UI/button'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import type { OrganizationDto } from '@/src/domains/admin/organizations/organizations.types'
import { OrganizationFormDialog } from './OrganizationFormDialog'

const TYPE_LABELS: Record<OrganizationDto['type'], string> = {
  LABEL: 'Label',
  PUBLISHER: 'Publisher',
  MANAGEMENT: 'Management',
  AGENCY: 'Agencia',
  MUSIC_LIBRARY: 'Music Library',
  OTHER: 'Otro',
}

export default function AdminOrganizationsPage() {
  const { data, isLoading, error } = adminOrganizationsHooks.useOrganizations()
  const [showCreate, setShowCreate] = useState(false)

  const columns: ColumnDef<OrganizationDto>[] = [
    {
      key: 'name',
      header: 'Organización',
      render: (org) => (
        <Link
          href={`/admin/organizations/${org.id}`}
          className="flex items-center gap-2 font-medium text-foreground hover:underline"
        >
          <Building2 className="h-4 w-4 text-muted-foreground" aria-hidden />
          {org.name}
        </Link>
      ),
    },
    { key: 'slug', header: 'Slug', render: (org) => <span className="text-muted-foreground">{org.slug}</span> },
    {
      key: 'type',
      header: 'Tipo',
      render: (org) => <Badge variant="secondary">{TYPE_LABELS[org.type] ?? org.type}</Badge>,
    },
    {
      key: 'status',
      header: 'Estado',
      render: (org) => (
        <Badge variant={org.isActive ? 'default' : 'destructive'}>
          {org.isActive ? 'Activa' : 'Inactiva'}
        </Badge>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organizaciones"
        description={`${data?.length ?? '—'} clientes B2B (labels, publishers, agencias...)`}
        actions={
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva organización
          </Button>
        }
      />

      <AdminDataTable
        columns={columns}
        data={data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar las organizaciones' : null}
        emptyMessage="Aún no hay organizaciones B2B. Crea la primera."
        keyExtractor={(row) => row.id}
      />

      <OrganizationFormDialog isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  )
}
