'use client'

import { usePathname } from 'next/navigation'
import { TierBadge } from './TierBadge'
import type { AffiliateTier } from '../../types/affiliate.types'

const SECTION_LABELS: Record<string, string> = {
  '/programa-afiliados/dashboard/referidos': 'Referidos',
  '/programa-afiliados/dashboard/comisiones': 'Comisiones',
  '/programa-afiliados/dashboard/perfil': 'Perfil',
  '/programa-afiliados/dashboard': 'Panel de afiliado',
}

interface AffiliateHeaderProps {
  affiliateName: string
  tier: AffiliateTier
}

export function AffiliateHeader({ affiliateName, tier }: AffiliateHeaderProps) {
  const pathname = usePathname()

  const section =
    Object.entries(SECTION_LABELS)
      .sort((a, b) => b[0].length - a[0].length)
      .find(([key]) => pathname.startsWith(key))?.[1] ?? 'Panel de afiliado'

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 sm:px-6 backdrop-blur-md">
      <h1 className="text-base font-semibold text-foreground pl-10 md:pl-0">{section}</h1>

      <div className="flex items-center gap-3">
        <TierBadge tier={tier} />
        <p className="text-xs text-muted-foreground hidden sm:block">
          <span className="font-medium text-foreground">{affiliateName}</span>
        </p>
      </div>
    </header>
  )
}
