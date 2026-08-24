'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Building2, Check, Plus, X } from 'lucide-react'
import { adminOrganizationsHooks } from '@/src/domains/admin/organizations/organizations.hooks'
import { AdminDataTable, type ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { Badge } from '@/src/shared/components/UI/badge'
import { Button } from '@/src/shared/components/UI/button'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { Tabs, TabsList, TabsTrigger } from '@/src/shared/components/UI/tabs'
import type { OrganizationDto, OrganizationStatus } from '@/src/domains/admin/organizations/organizations.types'
import { OrganizationFormDialog } from './OrganizationFormDialog'
import { RejectOrganizationDialog } from './RejectOrganizationDialog'

const TYPE_LABELS: Record<OrganizationDto['type'], string> = {
  LABEL: 'Label',
  PUBLISHER: 'Publisher',
  MANAGEMENT: 'Management',
  AGENCY: 'Agencia',
  MUSIC_LIBRARY: 'Music Library',
  OTHER: 'Otro',
}

const STATUS_LABELS: Record<OrganizationStatus, string> = {
  EN_TRAMITE: 'En trámite',
  APROBADA: 'Aprobada',
  CREADA: 'Creada',
  VERIFICADA: 'Verificada',
  RECHAZADA: 'Rechazada',
}

const STATUS_VARIANTS: Record<OrganizationStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  EN_TRAMITE: 'outline',
  APROBADA: 'secondary',
  CREADA: 'secondary',
  VERIFICADA: 'default',
  RECHAZADA: 'destructive',
}

const STATUS_TABS: { value: OrganizationStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Todas' },
  { value: 'EN_TRAMITE', label: 'En trámite' },
  { value: 'APROBADA', label: 'Aprobadas' },
  { value: 'CREADA', label: 'Creadas' },
  { value: 'VERIFICADA', label: 'Verificadas' },
  { value: 'RECHAZADA', label: 'Rechazadas' },
]

export default function AdminOrganizationsPage() {
  const [statusFilter, setStatusFilter] = useState<OrganizationStatus | 'ALL'>('ALL')
  const { data, isLoading, error } = adminOrganizationsHooks.useOrganizations(
    statusFilter === 'ALL' ? undefined : statusFilter,
  )
  const [showCreate, setShowCreate] = useState(false)
  const [rejectTarget, setRejectTarget] = useState<OrganizationDto | null>(null)
  const [markCreatedTarget, setMarkCreatedTarget] = useState<OrganizationDto | null>(null)

  const { mutate: approveOrganization, isPending: isApproving } = adminOrganizationsHooks.useApproveOrganization()
  const { mutate: markOrganizationCreated, isPending: isMarkingCreated } =
    adminOrganizationsHooks.useMarkOrganizationCreated()

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
        <Badge variant={STATUS_VARIANTS[org.status]}>{STATUS_LABELS[org.status] ?? org.status}</Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (org) => {
        if (org.status === 'EN_TRAMITE') {
          return (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="gap-1"
                disabled={isApproving}
                onClick={() => approveOrganization(org.id)}
              >
                <Check className="h-3.5 w-3.5" />
                Aprobar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="gap-1 text-destructive hover:text-destructive"
                onClick={() => setRejectTarget(org)}
              >
                <X className="h-3.5 w-3.5" />
                Rechazar
              </Button>
            </div>
          )
        }
        if (org.status === 'APROBADA') {
          return (
            <Button size="sm" variant="outline" onClick={() => setMarkCreatedTarget(org)}>
              Marcar como creada (pago manual)
            </Button>
          )
        }
        return <span className="text-muted-foreground text-sm">—</span>
      },
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

      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as OrganizationStatus | 'ALL')}>
        <TabsList>
          {STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <AdminDataTable
        columns={columns}
        data={data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar las organizaciones' : null}
        emptyMessage="No hay organizaciones en este estado."
        keyExtractor={(row) => row.id}
      />

      <OrganizationFormDialog isOpen={showCreate} onClose={() => setShowCreate(false)} />
      <RejectOrganizationDialog organization={rejectTarget} onClose={() => setRejectTarget(null)} />
      <AdminConfirmDialog
        isOpen={!!markCreatedTarget}
        onClose={() => setMarkCreatedTarget(null)}
        onConfirm={() => markCreatedTarget && markOrganizationCreated(markCreatedTarget.id, {
          onSuccess: () => setMarkCreatedTarget(null),
        })}
        isLoading={isMarkingCreated}
        title="Marcar como creada"
        description={`Confirma que ya validaste el pago/factura de "${markCreatedTarget?.name}" fuera de banda. Esta acción es solo para planes sin precio configurado.`}
        confirmLabel="Confirmar"
      />
    </div>
  )
}
