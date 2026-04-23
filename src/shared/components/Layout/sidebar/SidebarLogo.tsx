import { MusilaLogo } from '@/src/shared/components/Icons/icons'
import Link from 'next/link'

export function SidebarLogo() {
  return (
    <div className="p-6 border-b border-sidebar-border">
      <Link href="/app" className="flex items-center gap-2">
        <MusilaLogo className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold">
          <span className="text-primary">Músila</span>
          <span className="text-sidebar-foreground"> -App</span>
        </span>
      </Link>
    </div>
  )
}