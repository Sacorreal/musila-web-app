'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, FileText } from 'lucide-react'
import { adminChatHooks } from '@/src/domains/admin/readonly/chat/admin-chat.hooks'
import { cn } from '@/src/shared/libs/cn'

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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : !messages?.length ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Sin mensajes en este chat.</p>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'rounded-xl border border-border/50 p-3',
                  m.isSystem && 'bg-muted/40 italic',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-muted-foreground">
                    {m.isSystem ? 'Sistema' : m.sender ? `${m.sender.name} ${m.sender.lastName}` : 'Desconocido'}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {new Date(m.createdAt).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <p className="mt-1 text-sm">{m.content}</p>
                {m.fileUrl && (
                  <a
                    href={m.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-1.5 text-xs text-primary hover:underline"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    {m.fileName ?? 'Archivo adjunto'}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
