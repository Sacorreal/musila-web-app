'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Building2, ShieldCheck, Users, Settings2, Megaphone, Percent, Wallet, PenLine, LayoutDashboard, Stethoscope, Inbox, Lock } from 'lucide-react'
import { organizationsHooks } from '@/src/domains/organizations/organizations.hooks'
import { useOrganizationStore } from '@/src/domains/organizations/store/use-organization-store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/UI/select'

interface OrgWorkspaceShellProps {
  organizationId: string
  organizationName: string
  organizationOptions: { id: string; name: string }[]
  children: React.ReactNode
}

const NAV_ITEMS: { segment: string; icon: typeof ShieldCheck; label: string; capability?: string }[] = [
  { segment: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', capability: 'organization.members.view' },
  { segment: 'editorial-command-center', icon: Stethoscope, label: 'Health Score', capability: 'editorial.command_center.view' },
  { segment: 'promociones', icon: Megaphone, label: 'Pautas' },
  { segment: 'campanas', icon: Inbox, label: 'Campañas' },
  { segment: 'wallet', icon: Wallet, label: 'Wallet', capability: 'organization.settings.manage' },
  { segment: 'settings/comisiones', icon: Percent, label: 'Comisiones', capability: 'organization.settings.manage' },
  { segment: 'settings/publisher-share', icon: PenLine, label: "Publisher's Share", capability: 'organization.settings.manage' },
  { segment: 'settings/roles', icon: ShieldCheck, label: 'Roles', capability: 'organization.roles.view' },
  { segment: 'settings/members', icon: Users, label: 'Miembros', capability: 'organization.members.view' },
  { segment: 'settings/workspace', icon: Settings2, label: 'Workspace', capability: 'organization.settings.manage' },
  { segment: 'settings/security', icon: Lock, label: 'Seguridad', capability: 'organization.settings.manage' },
]

/** Shell del workspace B2B: switcher multi-organización + navegación filtrada por capabilities. */
export function OrgWorkspaceShell({
  organizationId,
  organizationName,
  organizationOptions,
  children,
}: OrgWorkspaceShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const setActiveOrganization = useOrganizationStore((state) => state.setActiveOrganization)
  const { data: capabilities } = organizationsHooks.useMyOrgCapabilities(organizationId)

  // Mantiene el header x-organization-id alineado con la URL del workspace.
  useEffect(() => {
    setActiveOrganization(organizationId)
    return () => setActiveOrganization(null)
  }, [organizationId, setActiveOrganization])

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.capability || !capabilities || capabilities.includes(item.capability),
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-2 font-semibold">
            <Building2 className="h-5 w-5 text-muted-foreground" aria-hidden />
            {organizationName}
          </div>

          {organizationOptions.length > 1 && (
            <Select
              value={organizationId}
              onValueChange={(nextOrganizationId) => router.push(`/org/${nextOrganizationId}/settings/roles`)}
            >
              <SelectTrigger className="w-[220px]" aria-label="Cambiar de organización">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {organizationOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <nav className="mx-auto flex max-w-6xl gap-1 px-4" aria-label="Secciones del workspace">
          {visibleItems.map((item) => {
            const href = `/org/${organizationId}/${item.segment}`
            const isActive = pathname.startsWith(href)
            return (
              <Link
                key={item.segment}
                href={href}
                className={`flex items-center gap-2 rounded-t-lg border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className="h-4 w-4" aria-hidden />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}
