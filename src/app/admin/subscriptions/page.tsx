'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { adminPlansHooks } from '@/src/domains/admin/plans/plans.hooks'
import { AdminDataTable, type ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
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
import type { SubscriptionDto } from '@/src/domains/admin/plans/plans.types'
import { SubscriptionEditDialog } from './SubscriptionEditDialog'

const ALL = '__all__'

const STATUS_VARIANT: Record<SubscriptionDto['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
  ACTIVE: 'default',
  PAST_DUE: 'outline',
  CANCELED: 'secondary',
  EXPIRED: 'destructive',
}

export default function AdminSubscriptionsPage() {
  const [page, setPage] = useState(1)
  const [subjectType, setSubjectType] = useState(ALL)
  const [status, setStatus] = useState(ALL)
  const limit = 20

  const { data, isLoading, error } = adminPlansHooks.useSubscriptions({
    page,
    limit,
    subjectType: subjectType === ALL ? undefined : subjectType,
    status: status === ALL ? undefined : status,
  })

  const [editTarget, setEditTarget] = useState<SubscriptionDto | null>(null)

  const columns: ColumnDef<SubscriptionDto>[] = [
    {
      key: 'subject',
      header: 'Sujeto',
      render: (subscription) => (
        <div className="min-w-0">
          <Badge variant="outline" className="mb-1 text-[10px]">
            {subscription.subjectType}
          </Badge>
          <p className="truncate font-mono text-xs text-muted-foreground">{subscription.subjectId}</p>
        </div>
      ),
    },
    {
      key: 'plan',
      header: 'Plan',
      render: (subscription) => (
        <div>
          <p className="text-sm font-medium">{subscription.plan?.name}</p>
          <p className="font-mono text-xs text-muted-foreground">{subscription.plan?.key}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      width: '110px',
      render: (subscription) => (
        <Badge variant={STATUS_VARIANT[subscription.status]}>{subscription.status}</Badge>
      ),
    },
    {
      key: 'period',
      header: 'Vigencia',
      render: (subscription) => (
        <span className="text-xs text-muted-foreground">
          {new Date(subscription.startAt).toLocaleDateString()} →{' '}
          {subscription.endAt ? new Date(subscription.endAt).toLocaleDateString() : 'Sin fin'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '60px',
      render: (subscription) => (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Editar subscription"
          onClick={() => setEditTarget(subscription)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscriptions"
        description={`${data?.total ?? '—'} contrataciones de planes (usuarios, guests y organizaciones)`}
        actions={
          <div className="flex gap-2">
            <Select value={subjectType} onValueChange={(value) => { setSubjectType(value); setPage(1) }}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sujeto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todos los sujetos</SelectItem>
                <SelectItem value="USER">Usuario</SelectItem>
                <SelectItem value="ORGANIZATION">Organización</SelectItem>
                <SelectItem value="TRACKSPACE">Trackspace</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1) }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todos</SelectItem>
                <SelectItem value="ACTIVE">Activa</SelectItem>
                <SelectItem value="PAST_DUE">En mora</SelectItem>
                <SelectItem value="CANCELED">Cancelada</SelectItem>
                <SelectItem value="EXPIRED">Vencida</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar las subscriptions' : null}
        emptyMessage="No hay subscriptions para este filtro"
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />

      <SubscriptionEditDialog subscription={editTarget} onClose={() => setEditTarget(null)} />
    </div>
  )
}
