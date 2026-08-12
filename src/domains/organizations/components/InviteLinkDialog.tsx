'use client'

import { useMemo, useState } from 'react'
import { Check, Copy, Link2, Loader2, RefreshCw, ShieldX } from 'lucide-react'
import { toast } from 'sonner'
import { organizationsHooks } from '../organizations.hooks'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Label } from '@/src/shared/components/UI/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/shared/components/UI/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/src/shared/components/UI/alert-dialog'

interface Props {
  organizationId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatExpiration(expiresAt?: string | null): string {
  if (!expiresAt) return 'Sin expiración'
  return `Expira el ${new Date(expiresAt).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}`
}

export function InviteLinkDialog({ organizationId, open, onOpenChange }: Props) {
  const { data: link, isLoading, error } = organizationsHooks.useInviteLink(open ? organizationId : undefined)
  const { mutate: regenerate, isPending: isRegenerating } =
    organizationsHooks.useRegenerateInviteLink(organizationId)
  const { mutate: revoke, isPending: isRevoking } =
    organizationsHooks.useRevokeInviteLink(organizationId)

  const [copied, setCopied] = useState(false)

  const inviteUrl = useMemo(() => {
    if (!link) return ''
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    return `${origin}/workspace-invite/${link.token}`
  }, [link])

  const handleCopy = async () => {
    if (!inviteUrl) return
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      toast.success('Enlace copiado al portapapeles')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('No se pudo copiar el enlace')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Invitar usuarios
          </DialogTitle>
          <DialogDescription>
            Comparte este enlace con tu equipo. Cada persona que se registre generará una solicitud
            de acceso que podrás aprobar asignándole un tipo y un rol.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-3" aria-busy="true">
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
            <div className="h-3 w-40 animate-pulse rounded bg-muted" />
          </div>
        ) : error ? (
          <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            No se pudo cargar el enlace de invitación. Intenta de nuevo.
          </p>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="invite-url">Enlace de invitación</Label>
              <div className="flex items-center gap-2">
                <Input id="invite-url" readOnly value={inviteUrl} className="font-mono text-xs" />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  aria-label="Copiar enlace"
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatExpiration(link?.expiresAt)}
              {typeof link?.maxUses === 'number' ? ` · ${link.useCount}/${link.maxUses} usos` : ` · ${link?.useCount ?? 0} registros`}
            </p>
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="gap-2 text-red-500 hover:text-red-600" disabled={isRevoking || !link}>
                <ShieldX className="h-4 w-4" />
                Revocar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Revocar el enlace de invitación?</AlertDialogTitle>
                <AlertDialogDescription>
                  El enlace actual dejará de funcionar de inmediato para todos. Podrás generar uno
                  nuevo cuando quieras. Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => revoke(undefined, { onSuccess: () => onOpenChange(false) })}
                >
                  Revocar enlace
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            type="button"
            variant="outline"
            className="gap-2"
            disabled={isRegenerating}
            onClick={() => regenerate(undefined)}
          >
            {isRegenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Regenerar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
