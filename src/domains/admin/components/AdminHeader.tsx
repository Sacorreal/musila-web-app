'use client'

import { usePathname } from 'next/navigation'
import { Shield, Menu } from 'lucide-react'
import { Button } from '@/src/shared/components/UI/button'

const sectionLabels: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/users': 'Usuarios',
  '/admin/genres': 'Géneros Musicales',
  '/admin/tracks': 'Tracks',
  '/admin/requests': 'Solicitudes',
  '/admin/intellectual-property': 'Propiedad Intelectual',
  '/admin/guests': 'Invitados',
  '/admin/invites': 'Invitaciones',
  '/admin/affiliates': 'Afiliados',
  '/admin/commissions': 'Comisiones',
  '/admin/payments': 'Pagos',
  '/admin/payment-sources': 'Fuentes de Pago',
  '/admin/pending-registrations': 'Registros Pendientes',
  '/admin/playlists': 'Playlists',
  '/admin/chat': 'Chats',
  '/admin/notifications': 'Notificaciones',
  '/admin/audit-log': 'Auditoría',
}

interface AdminHeaderProps {
  userName?: string
}

export function AdminHeader({ userName }: AdminHeaderProps) {
  const pathname = usePathname()

  const section = Object.entries(sectionLabels)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([key]) => pathname.startsWith(key))?.[1] ?? 'Admin'

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Shield className="h-4 w-4 text-red-500" />
        <h1 className="text-base font-semibold text-foreground">{section}</h1>
      </div>

      {userName && (
        <p className="text-xs text-muted-foreground hidden sm:block">
          Sesión: <span className="font-medium text-foreground">{userName}</span>
        </p>
      )}
    </header>
  )
}
