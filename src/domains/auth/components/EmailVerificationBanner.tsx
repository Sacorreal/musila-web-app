'use client'

import { useState } from 'react'
import { MailWarning, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '../store/use-auth-store'
import { resendVerificationRequest } from '../services/auth.actions'

export function EmailVerificationBanner() {
  const user = useAuthStore((s) => s.user)
  const [dismissed, setDismissed] = useState(false)
  const [isSending, setIsSending] = useState(false)

  if (!user || user.isVerified !== false || dismissed) return null

  const handleResend = async () => {
    setIsSending(true)
    try {
      const res = await resendVerificationRequest(user.email)
      toast.success(res.message)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al reenviar el correo')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 border-b border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-sm">
      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
        <MailWarning className="h-4 w-4 shrink-0" />
        <span>
          Verifica tu correo para publicar tracks, playlists y solicitudes de licencia.
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleResend}
          disabled={isSending}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-amber-700 underline decoration-dotted hover:text-amber-900 disabled:opacity-50 dark:text-amber-400 dark:hover:text-amber-300"
        >
          {isSending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          Reenviar correo
        </button>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Cerrar aviso"
          className="text-amber-700/70 hover:text-amber-900 dark:text-amber-400/70 dark:hover:text-amber-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
