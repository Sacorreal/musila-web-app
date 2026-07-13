'use client'

import { useState } from 'react'
import { adminChatHooks } from '@/src/domains/admin/readonly/chat/admin-chat.hooks'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { getChatColumns } from './chat-columns'

export default function AdminChatsPage() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, error } = adminChatHooks.useAdminChats(page, limit)

  const columns = getChatColumns()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chats"
        description={`${data?.total ?? '—'} chats en el sistema — solo lectura`}
      />

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
