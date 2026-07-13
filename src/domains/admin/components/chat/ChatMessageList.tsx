import { Loader2 } from 'lucide-react'
import { ChatMessageBubble } from './ChatMessageBubble'
import type { AdminMessageDto } from '@/src/domains/admin/readonly/chat/admin-chat.types'

interface ChatMessageListProps {
  messages: AdminMessageDto[] | undefined
  isLoading: boolean
}

export function ChatMessageList({ messages, isLoading }: ChatMessageListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!messages?.length) {
    return <p className="py-12 text-center text-sm text-muted-foreground">Sin mensajes en este chat.</p>
  }

  return (
    <div className="space-y-4">
      {messages.map((m) => (
        <ChatMessageBubble key={m.id} message={m} />
      ))}
    </div>
  )
}
