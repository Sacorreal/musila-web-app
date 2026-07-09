'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import { adminChatHooks } from '@/src/domains/admin/readonly/chat/admin-chat.hooks'
import { AdminDataTable, type ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import type { AdminChatDto } from '@/src/domains/admin/readonly/chat/admin-chat.types'

export default function AdminChatsPage() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, error } = adminChatHooks.useAdminChats(page, limit)

  const columns: ColumnDef<AdminChatDto>[] = [
    {
      key: 'track',
      header: 'Track',
      width: '2fr',
      render: (row) => <p className="truncate text-sm font-semibold">{row.request?.track?.title ?? '—'}</p>,
    },
    {
      key: 'requester',
      header: 'Solicitante',
      width: '1.5fr',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.request?.requester ? `${row.request.requester.name} ${row.request.requester.lastName}` : '—'}
        </span>
      ),
    },
    {
      key: 'owner',
      header: 'Propietario',
      width: '1.5fr',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.request?.owner ? `${row.request.owner.name} ${row.request.owner.lastName}` : '—'}
        </span>
      ),
    },
    {
      key: 'guests',
      header: 'Invitados',
      width: '90px',
      render: (row) => <span className="text-xs text-muted-foreground">{row.guests?.length ?? 0}</span>,
    },
    {
      key: 'createdAt',
      header: 'Creado',
      width: '110px',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '90px',
      render: (row) => (
        <Link href={`/admin/chat/${row.id}`} className="flex items-center gap-1 text-xs text-primary hover:underline">
          <MessageSquare className="h-3 w-3" />
          Ver
        </Link>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black tracking-tight">Chats</h2>
        <p className="text-sm text-muted-foreground">{data?.total ?? '—'} chats en el sistema — solo lectura</p>
      </div>

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar los chats' : null}
        emptyMessage="No hay chats registrados"
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />
    </div>
  )
}
