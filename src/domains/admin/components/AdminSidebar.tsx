'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Music,
  Headphones,
  FileText,
  ArrowLeft,
  Shield,
  ChevronDown,
  Package,
  DollarSign,
  Activity,
  UserPlus,
  Mail,
  Handshake,
  Percent,
  CreditCard,
  Wallet,
  Clock,
  ListMusic,
  MessageSquare,
  Bell,
  ScrollText,
} from 'lucide-react'
import { cn } from '@/src/shared/libs/cn'
import { MusilaLogo } from '@/src/shared/components/Icons/icons'

interface NavItem {
  href: string
  icon: typeof LayoutDashboard
  label: string
  exact?: boolean
}

interface NavGroup {
  label: string
  icon: typeof LayoutDashboard
  items: NavItem[]
}

const dashboardItem: NavItem = { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true }

const navGroups: NavGroup[] = [
  {
    label: 'Contenido',
    icon: Package,
    items: [
      { href: '/admin/tracks', icon: Headphones, label: 'Tracks' },
      { href: '/admin/genres', icon: Music, label: 'Géneros' },
      { href: '/admin/intellectual-property', icon: ScrollText, label: 'Propiedad Intelectual' },
    ],
  },
  {
    label: 'Usuarios',
    icon: Users,
    items: [
      { href: '/admin/users', icon: Users, label: 'Usuarios' },
      { href: '/admin/guests', icon: UserPlus, label: 'Invitados' },
      { href: '/admin/invites', icon: Mail, label: 'Invitaciones' },
    ],
  },
  {
    label: 'Monetización',
    icon: DollarSign,
    items: [
      { href: '/admin/affiliates', icon: Handshake, label: 'Afiliados' },
      { href: '/admin/commissions', icon: Percent, label: 'Comisiones' },
      { href: '/admin/payments', icon: CreditCard, label: 'Pagos' },
      { href: '/admin/payment-sources', icon: Wallet, label: 'Fuentes de Pago' },
      { href: '/admin/pending-registrations', icon: Clock, label: 'Registros Pendientes' },
    ],
  },
  {
    label: 'Actividad',
    icon: Activity,
    items: [
      { href: '/admin/requests', icon: FileText, label: 'Solicitudes' },
      { href: '/admin/playlists', icon: ListMusic, label: 'Playlists' },
      { href: '/admin/chat', icon: MessageSquare, label: 'Chats' },
      { href: '/admin/notifications', icon: Bell, label: 'Notificaciones' },
      { href: '/admin/audit-log', icon: ScrollText, label: 'Auditoría' },
    ],
  },
]

const isActive = (pathname: string, href: string, exact?: boolean) =>
  exact ? pathname === href : pathname.startsWith(href)

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      className={cn(
        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
        active
          ? 'bg-primary/10 text-primary shadow-sm'
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
      )}
    >
      <Icon
        className={cn(
          'h-4 w-4 shrink-0 transition-colors',
          active ? 'text-primary' : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground',
        )}
      />
      {item.label}
    </Link>
  )
}

function NavGroupSection({ group, pathname }: { group: NavGroup; pathname: string }) {
  const groupHasActiveItem = group.items.some((item) => isActive(pathname, item.href, item.exact))
  const [isOpen, setIsOpen] = useState(groupHasActiveItem)
  const GroupIcon = group.icon

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-black uppercase tracking-widest text-sidebar-foreground/50 transition-colors hover:text-sidebar-foreground/80"
        aria-expanded={isOpen}
      >
        <GroupIcon className="h-3.5 w-3.5 shrink-0" />
        <span className="flex-1 text-left">{group.label}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 shrink-0 transition-transform', isOpen && 'rotate-180')} />
      </button>
      {isOpen && (
        <div className="flex flex-col gap-1">
          {group.items.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(pathname, item.href, item.exact)} />
          ))}
        </div>
      )}
    </div>
  )
}

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl md:flex">
      {/* Logo + badge */}
      <div className="flex flex-col gap-2 px-6 py-6 border-b border-sidebar-border">
        <MusilaLogo className="h-8 w-auto" />
        <div className="flex items-center gap-1.5 mt-1">
          <Shield className="h-3.5 w-3.5 text-red-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-red-500">
            Panel Admin
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-4 flex-1 overflow-y-auto px-3 py-4">
        <NavLink item={dashboardItem} active={isActive(pathname, dashboardItem.href, dashboardItem.exact)} />
        {navGroups.map((group) => (
          <NavGroupSection key={group.label} group={group} pathname={pathname} />
        ))}
      </nav>

      {/* Footer — back to app */}
      <div className="border-t border-sidebar-border px-3 py-4">
        <Link
          href="/music"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/60 transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          Volver a la App
        </Link>
      </div>
    </aside>
  )
}
