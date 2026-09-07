'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { adminChatHooks } from '@/src/domains/admin/readonly/chat/admin-chat.hooks'
import { ChatMessageList } from '@/src/domains/admin/components/chat/ChatMessageList'

export default function AdminChatDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const chatId = params.id

  const { data: messages, isLoading } = adminChatHooks.useAdminChatMessages(chatId)

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push('/admin/chat')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Chats
      </button>

      <div>
        <h2 className="text-xl font-black tracking-tight">Conversación</h2>
        <p className="text-sm text-muted-foreground">Solo lectura — {messages?.length ?? 0} mensajes</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <ChatMessageList messages={messages} isLoading={isLoading} />
      </div>
    </div>
  )
}
