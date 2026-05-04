import { MusilaLogo } from '@/src/shared/components/Icons/icons'
import Link from 'next/link'

export function SidebarLogo() {
  return (
    <div className="p-6 border-b border-sidebar-border">
      <Link href="/app" className="flex items-center">
        <MusilaLogo className="h-10 w-auto" />
      </Link>
    </div>
  )
}