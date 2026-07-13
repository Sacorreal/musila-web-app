import { FileText } from 'lucide-react'
import { cn } from '@/src/shared/libs/cn'
import type { AdminMessageDto } from '@/src/domains/admin/readonly/chat/admin-chat.types'

interface ChatMessageBubbleProps {
  message: AdminMessageDto
}

export function ChatMessageBubble({ message: m }: ChatMessageBubbleProps) {
  return (
    <div
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
  )
}
